;; Owner
(define-constant contract-owner tx-sender)

;; Errors
(define-constant err-owner-only (err u100))
(define-constant err-already-locked (err u101))
(define-constant err-not-enough-funds (err u102))
(define-constant locked-wallet (err u99))

;; Variables
(define-data-var builder principal 'SP194138VA57FKR364CBH0DZBCXT7RS4BJEQZ8SP3)
(define-data-var dao principal 'SP194138VA57FKR364CBH0DZBCXT7RS4BJEQZ8SP3)
(define-data-var locked bool false)


(define-private (not-locked) 
    (ok (asserts! (is-eq (var-get locked) false) (err locked-wallet)))
)

(define-public (start (owner-of-campaign principal) )
    (begin
        (var-set builder owner-of-campaign)
        (var-set dao tx-sender)
        (ok true)
    )
)


(define-public (withdraw (reason (string-ascii 50)) (amount uint))
    (begin
        (try! (not-locked))
        (asserts! (is-eq tx-sender (var-get builder)) (err err-owner-only))
        (asserts! (<= (as-contract (stx-get-balance tx-sender)) amount) (err err-not-enough-funds))
        (ok (as-contract (stx-transfer? amount tx-sender (var-get builder))))
    )
)

(define-public (deposit (amount uint))
    (begin 
        (try! (not-locked))
        (ok (stx-transfer? amount tx-sender (as-contract tx-sender)))
    )
)

;; Ask about freezing contract completely both deposit function and just straight up chain 


(define-trait wallet-trait (
    (start (principal) (response bool bool))
    (withdraw ((string-ascii 50) uint) (response bool bool))
    (deposit (uint) (response bool bool))
))
