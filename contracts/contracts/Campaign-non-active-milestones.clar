;; errors
(define-constant ERR-NOT-ENOUGH-FUNDS (err u100))
(define-constant ERR-ALREADY-FUNDED (err u101))
(define-constant ERR-ALREADY-CLAIMED (err u102))
(define-constant ERR-NO-ACTIVE-MILESTONE-SUBMISSIONS (err u103))
(define-constant ERR-ONLY-OWNER (err u104))
(define-constant ERR-ALREADY-VOTED (err u105))
(define-constant ERR-CONTRACT-FROZEN (err u106))

;; global variables
(define-data-var funding-goal uint u0)
(define-data-var end-block uint u0)
(define-map milestones uint {
    milestoneDescription:string-ascii 100, 
    votes:uint, approved:bool, 
    claimed:bool, 
    finishedMilestone: string-ascii 100
})
(define-map donator-stx-tokens principal uint)
(define-data-var num-donators uint u0)
(define-data-var funded bool false)
(define-data-var total-tokens uint u0)
(define-data-var stats-per-token uint u0)
(define-data-var claimed-first bool false)
(define-data-var owner principal tx-sender)
(define-map has-voted-milestone { user:principal, milestone:uint} bool)
(define-map vote-frozen principal bool)
(define-data-var num-frozen-votes uint u0)
(define-data-var frozen bool false)
(define-map refunded principal bool)

;; Private Functions

;; @dev Function checks whether or not the contract is funded
(define-private (funding-ended)
    (ok (asserts! (is-eq (var-get funded) false) ERR-ALREADY-FUNDED))
)

;; @dev Function checks if funding period is over

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


;; @param uint funding-goal The goal in micro-stx for the cmapaign to hit
;; @param uint block-duration The number of blocks that the funding campaign will be open
;; @param uint num-milestones The number of milestones the money will be split up into
;; @dev This function should be run after contract is deployed to set the inital values
;;      for the campaign

(define-public (start (funding-goal_ uint) (block-duration_ uint) (num-milestones_ uint)) 
    (begin
        (asserts! (is-eq (var-get owner) tx-sender) (err ERR-ONLY-OWNER))
        (var-set funding-goal funding-goal_)
        (var-set end-block (+ block-height block-duration_))
        ()
        (ok true)
    )
)

;; Funding Related Functions

;; @param uint amount The amount of micro-stx to donate
;; @dev This function is run to donate to the campaign

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


;; @dev This function refunds a users donation if the contract is frozen by 
;;      not being funded before time runs out or if fully funded and users 
;;      choose to freeze the contract

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
        (as-contract (stx-transfer? (* (var-get stats-per-token) (default-to u0 (map-get? donator-stx-tokens sender))) tx-sender sender)))
)

;; @dev This function can only be run by the project creator to claim their first milestone after
;;      project is initially funded

;; change to claim-milestone and input an index
(define-public (claim-milestone (uint index)) 
    (begin 
        (asserts! (is-eq tx-sender (var-get owner))  ERR-ONLY-OWNER)
        (asserts! (is-eq (var-get funded) true) ERR-NOT-ENOUGH-FUNDS)
        ;; (asserts! (is-eq (var-get claimed-first) false) ERR-ALREADY-CLAIMED)
        ;; (var-set current-milestone (+ u1 (var-get current-milestone)))
        ;; (var-set claimed-first true)
        ;; (as-contract (stx-transfer? (/ (stx-get-balance tx-sender) (var-get num-milestones)) tx-sender (var-get owner)))
    )
)

;; @param string-ascii submission-details The link to the milestone details
;; @dev This function can only be run by the project creator to submit the details of 
;;      the active milestone
(define-public (submit-milestone (submission-details (string-ascii 100)))
    (begin 
        (asserts! (is-eq tx-sender (var-get owner))  ERR-ONLY-OWNER)
        (map-insert milestone-details (var-get current-milestone) {details:submission-details})
        (map-insert has-submitted-milestone (var-get current-milestone) true)
        (ok true)
    )
)

;; @dev This function votes yes on the current milestone. To vote no, don't vote

(define-public (vote-on-milestone) 
    (begin  
        (asserts! (default-to false (map-get? has-submitted-milestone (var-get current-milestone))) ERR-NO-ACTIVE-MILESTONE-SUBMISSIONS)
        (asserts! (default-to true (map-get? has-voted-milestone {user:tx-sender, milestone:(var-get current-milestone)})) ERR-ALREADY-VOTED)
        (map-insert milestone-votes (var-get current-milestone) 
            (+ 
                (default-to u0 (map-get? donator-stx-tokens tx-sender)) 
                (default-to u0 (map-get? milestone-votes (var-get current-milestone)))
            )
        )
        (map-insert has-voted-milestone {user:tx-sender, milestone:(var-get current-milestone)} false)
        (if (> (default-to u0 (map-get? milestone-votes (var-get current-milestone))) (/ (var-get total-tokens) u2)) 
                (begin 
                    (var-set current-milestone (+ u1 (var-get current-milestone)))
                    (as-contract (stx-transfer? (/ (stx-get-balance tx-sender) (var-get num-milestones)) tx-sender (var-get owner)))
                )
                (ok (var-set current-milestone (var-get current-milestone)))
        )
    )
)

;; @dev This function votes to freeze the contract so users can be refunded if they choose
(define-public (vote-to-freeze)
    (begin
        (asserts! (default-to true (map-get? vote-frozen tx-sender)) (err ERR-ALREADY-VOTED))
        (map-insert vote-frozen tx-sender false)
        (var-set num-frozen-votes (+ (default-to u0 (map-get? donator-stx-tokens tx-sender)) (var-get num-frozen-votes)))
        (if ( > (var-get num-frozen-votes) (/ (var-get total-tokens) u2))
            (begin 
                (var-set frozen true)
                (ok (var-set stats-per-token (/ (stx-get-balance (as-contract tx-sender)) (var-get total-tokens))))
            )
            (ok true)
        ) 
    ) 
)

;; Read Functions

(define-read-only (read-funding-goal) 
    (var-get funding-goal)
)


(define-read-only (read-end-block) 
    (var-get end-block)
)


(define-read-only (read-milestones) 
    (var-get num-milestones)
)


(define-read-only (get-num-donator-stx-tokens (address principal)) 
    (default-to u0 (map-get? donator-stx-tokens address))
)


(define-read-only (read-num-donators)
    (var-get num-donators)
)


(define-read-only (read-funded)
    (var-get funded)
)


(define-read-only (read-total-tokens)
    (var-get total-tokens)
)


(define-read-only (read-stats-per-token)
    (var-get stats-per-token)
)


(define-read-only (read-claimed-first)
    (var-get claimed-first)
)


(define-read-only (read-owner)
    (var-get owner)
)


(define-read-only (get-milestone-details (milestone uint)) 
    (map-get? milestone-details milestone)
)


(define-read-only (read-current-milestone)
    (var-get current-milestone)
)


(define-read-only (has-milestone-been-submitted (milestone uint))
    (default-to false (map-get? has-submitted-milestone milestone))
)


(define-read-only (get-milestone-votes (milestone uint))
    (default-to u0 (map-get? milestone-votes milestone))
)


(define-read-only (has-user-voted (user principal) (milestone uint))
    (default-to false (map-get? has-voted-milestone {user: user, milestone: milestone}))
)


(define-read-only (is-vote-frozen (address principal))
    (default-to false (map-get? vote-frozen address))
)


(define-read-only (read-num-frozen-votes)
    (var-get num-frozen-votes))


(define-read-only (read-frozen)
    (var-get frozen)
)


(define-read-only (has-been-refunded (address principal))
    (default-to false (map-get? refunded address))
)


(define-read-only (get-balance)
    (stx-get-balance (as-contract tx-sender))
)
