;;; @contract Crowdsource DAO
;;; @version 1


(define-constant ERR-NOT-ENOUGH-FUNDS (err u100))
(define-constant ERR-ALREADY-FUNDED (err u101))
(define-constant ERR-ALREADY-CLAIMED (err u102))
(define-constant ERR-ONLY-OWNER (err u104))
(define-constant ERR-ALREADY-VOTED (err u105))
(define-constant ERR-CONTRACT-FROZEN (err u106))
(define-constant ERR-OUT-OF-RANGE (err u107))
(define-constant ERR-ALREADY-CONFIRMED (err u108))

(define-data-var funding-goal uint u0)
(define-data-var end-block uint u0)
(define-map milestones uint {
    submitted: bool,
    votes: uint, 
    approved: bool, 
    claimed: bool, 
    finishedMilestone: (string-ascii 36)
})
(define-map donator-stx-tokens principal uint)
(define-data-var num-donators uint u0)
(define-data-var funded bool false)
(define-data-var total-tokens uint u0)
(define-data-var stats-per-token uint u0)
(define-data-var owner principal tx-sender)
(define-map has-voted-milestone { user:principal, milestone:uint} bool)
(define-map vote-frozen principal bool)
(define-data-var num-frozen-votes uint u0)
(define-data-var frozen bool false)
(define-map refunded principal bool)
(define-data-var milestones-unclaimed uint u0)
(define-data-var num-milestones uint u0)

;; @desc Function checks whether or not the contract is funded
(define-private (funding-ended)
    (ok (asserts! (is-eq (var-get funded) false) ERR-ALREADY-FUNDED))
)

;; @desc Function checks if funding period is over
(define-private (check-end-deadline) 
    (begin
        (asserts! (is-eq true true) (err u1))
        (if (>= block-height (var-get funding-goal))
        (begin 
            (var-set frozen true)
            (ok (var-set stats-per-token (/ (stx-get-balance (as-contract tx-sender)) (var-get total-tokens))))
        )
        (ok true))
    )
)

;;; @desc This function should be run after contract is deployed to set the inital values
;;;      for the campaign
;;; @param uint funding-goal; The goal in micro-stx for the cmapaign to hit
;;; @param uint block-duration; The number of blocks that the funding campaign will be open
;;; @param uint num-milestones; The number of milestones the money will be split up into
(define-public (start (funding-goal_ uint) (block-duration_ uint) (num-milestones_ uint)) 
    (begin
        (asserts! (is-eq (var-get owner) tx-sender) (err ERR-ONLY-OWNER))
        (var-set funding-goal funding-goal_)
        (var-set end-block (+ block-height block-duration_))
        (var-set num-milestones num-milestones_)
        (var-set milestones-unclaimed num-milestones_)
        (ok true)
    )
)

;;; @desc This function is run to donate to the campaign
;;; @param uint amount; The amount of micro-stx to donate
(define-public (donate (amount uint))
    (begin 
        (try! (funding-ended)) 
        (try! (check-end-deadline))
        (asserts! (> (stx-get-balance tx-sender) amount) ERR-NOT-ENOUGH-FUNDS)
        (map-insert donator-stx-tokens tx-sender amount)
        (var-set num-donators (+ u1 (var-get num-donators)))
        (var-set total-tokens (+ (var-get total-tokens) amount))
        (if (< (var-get funding-goal) (+ (stx-get-balance (as-contract tx-sender)) amount)) 
            (var-set funded true) 
            (var-set frozen false)
        )
        (stx-transfer? amount tx-sender (as-contract tx-sender))
    ) 
)


;;; @desc This function allows users to claim a refund of their donation under two conditions:
;;;       1. If the contract is frozen due to not reaching the funding goal before the deadline
;;;       2. If the contract is fully funded but users collectively decide to freeze it
(define-public (claim-refund) 
    (let ((sender tx-sender))
        (asserts! (< (var-get funding-goal) (stx-get-balance (as-contract tx-sender))) ERR-NOT-ENOUGH-FUNDS)
        (asserts! (is-eq (var-get frozen) true)  ERR-CONTRACT-FROZEN)
        (asserts! (default-to true (map-get? refunded tx-sender)) ERR-ALREADY-CLAIMED)
        (asserts! 
            (>= 
                (stx-get-balance (as-contract tx-sender)) 
                (* (var-get stats-per-token) (default-to u0 (map-get? donator-stx-tokens tx-sender)))
            ) 
            ERR-NOT-ENOUGH-FUNDS
        )

        (map-insert refunded tx-sender true)

        (as-contract 
            (stx-transfer? 
                (* 
                    (var-get stats-per-token) 
                    (default-to u0 (map-get? donator-stx-tokens sender))
                ) 
                tx-sender 
                sender
            )
        )
    )
)

;;; @desc This function can only be run by the project creator to claim their first milestone
;;;       after project is initially funded
(define-public (claim-milestone (index uint)) 
    (begin
        (asserts! (is-eq tx-sender (var-get owner)) ERR-ONLY-OWNER)
        (asserts! (is-eq (var-get funded) true) ERR-NOT-ENOUGH-FUNDS)
        (asserts! (<= index (var-get num-milestones)) ERR-OUT-OF-RANGE)
        (asserts! (is-eq (default-to true (get claimed (map-get? milestones index))) true) ERR-ALREADY-CLAIMED)

        (try! (as-contract 
                (stx-transfer? (/ (stx-get-balance tx-sender) (var-get milestones-unclaimed)) tx-sender (var-get owner))
            )
        )

        (map-insert milestones index 
            (merge 
                (default-to 
                    {submitted: false, votes: u0, approved: false, claimed: false, finishedMilestone:""} 
                    (map-get? milestones index)
                ) {claimed: true}
            )
        )

        (var-set milestones-unclaimed (- u1 (var-get milestones-unclaimed)))

        (ok true)
    )
)

;;; @desc This function can only be run by the project creator to submit the details of 
;;;       the active milestone
;;; @param string-ascii submission-details; The link to the milestone details
(define-public (submit-milestone (submission-details (string-ascii 36)) (index uint))
    (begin 
        (asserts! (<= index (var-get num-milestones)) ERR-OUT-OF-RANGE)
        (asserts! (is-eq tx-sender (var-get owner))  ERR-ONLY-OWNER)

        (map-insert milestones 
            index 
            (merge 
                (default-to 
                    {submitted: false, votes: u0, approved: false, claimed: false, finishedMilestone:""} 
                    (map-get? milestones index)
                ) 
                {submitted: true, finishedMilestone: submission-details}
            )
        )

        (ok true)
    )
)

;;; @desc This function allows a user to vote in favor of the current milestone.
;;;       Users who wish to vote against the milestone simply abstain from voting.
(define-public (vote-on-milestone (index uint)) 
    (begin  
        (asserts! (<= index (var-get num-milestones)) ERR-OUT-OF-RANGE)
        (asserts! (default-to true 
                (map-get? has-voted-milestone {user:tx-sender, milestone:index})) 
            ERR-ALREADY-VOTED
        )
        (asserts! (> 
                    (get votes 
                        (default-to 
                            {submitted: false, votes: u0, approved: false, claimed: false, finishedMilestone:""} 
                            (map-get? milestones index)
                        )
                    )
                    (/ (var-get total-tokens) u2)
                ) 
                ERR-ALREADY-CONFIRMED
        )

        (map-insert milestones 
            index 
            (merge 
                (default-to 
                    {submitted: false, votes: u0, approved: false, claimed: false, finishedMilestone:""} 
                    (map-get? milestones index)
                ) 
                {votes: (+ u1 (default-to u0 (get votes (map-get? milestones index))))}
            )
        )

        (if (> (default-to u0 (get votes (map-get? milestones index))) (/ (var-get total-tokens) u2))
            (ok (map-insert milestones 
                index 
                (merge 
                    (default-to 
                        {submitted: false, votes: u0, approved: false, claimed: false, finishedMilestone:""} 
                        (map-get? milestones index)
                    )  
                    {approved: true}
                )
            ))
            (ok true)
        )
    )
)

;;; @desc This function votes to freeze the contract so users can be refunded if they choose
(define-public (vote-to-freeze)
    (begin
        (asserts! (default-to true (map-get? vote-frozen tx-sender)) (err ERR-ALREADY-VOTED))

        (map-insert vote-frozen tx-sender false)

        (var-set 
            num-frozen-votes 
            (+ 
                (default-to u0 (map-get? donator-stx-tokens tx-sender)) 
                (var-get num-frozen-votes)
            )
        )

        (if ( > (var-get num-frozen-votes) (/ (var-get total-tokens) u2))
            (begin 
                (var-set frozen true)
                (ok (var-set stats-per-token (/ (stx-get-balance (as-contract tx-sender)) (var-get total-tokens))))
            )
            (ok true)
        ) 
    ) 
)


;;; @desc Returns the funding goal of the campaign
(define-read-only (read-funding-goal) 
    (var-get funding-goal)
)

;;; @desc Returns the end block of the funding period
(define-read-only (read-end-block) 
    (var-get end-block)
)

;;; @desc Returns the number of milestones in the project
(define-read-only (read-milestones) 
    (var-get num-milestones)
)

;;; @desc Returns the number of STX tokens donated by a specific address
(define-read-only (get-num-donator-stx-tokens (address principal)) 
    (default-to u0 (map-get? donator-stx-tokens address))
)

;;; @desc Returns the total number of donators
(define-read-only (read-num-donators)
    (var-get num-donators)
)

;;; @desc Returns whether the project is fully funded
(define-read-only (read-funded)
    (var-get funded)
)

;;; @desc Returns the total number of tokens donated
(define-read-only (read-total-tokens)
    (var-get total-tokens)
)

;;; @desc Returns the stats per token (used for refunds)
(define-read-only (read-stats-per-token)
    (var-get stats-per-token)
)

;;; @desc Returns the owner's address of the contract
(define-read-only (read-owner)
    (var-get owner)
)

;;; @desc Checks if a user has voted on a specific milestone
(define-read-only (has-user-voted (user principal) (milestone uint))
    (default-to false (map-get? has-voted-milestone {user: user, milestone: milestone}))
)

;;; @desc Checks if a user's vote is frozen
(define-read-only (is-vote-frozen (address principal))
    (default-to false (map-get? vote-frozen address))
)

;;; @desc Returns the number of votes to freeze the contract
(define-read-only (read-num-frozen-votes)
    (var-get num-frozen-votes))

;;; @desc Returns whether the contract is frozen
(define-read-only (read-frozen)
    (var-get frozen)
)

;;; @desc Checks if an address has been refunded
(define-read-only (has-been-refunded (address principal))
    (default-to false (map-get? refunded address))
)

;;; @desc Returns the current balance of the contract
(define-read-only (get-balance)
    (stx-get-balance (as-contract tx-sender))
)