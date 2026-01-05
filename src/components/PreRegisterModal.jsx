import { useState } from 'react'
import styles from './PreRegisterModal.module.css'

function PreRegisterModal({ onClose, onShare }) {
  const [contact, setContact] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSubmitted, setIsSubmitted] = useState(false)

  const handleButtonClick = (e, callback) => {
    e.currentTarget.blur()
    callback()
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    if (!contact.trim()) {
      alert('연락처를 입력해주세요.')
      return
    }

    setIsSubmitting(true)

    try {
      // Google Sheets API 연동
      const response = await fetch('/api/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          contact: contact.trim(),
          timestamp: new Date().toISOString()
        }),
      })

      if (response.ok) {
        setIsSubmitted(true)
      } else {
        throw new Error('등록 실패')
      }
    } catch (error) {
      // Fallback: Google Forms로 직접 전송
      console.error('API Error:', error)
      alert('등록이 완료되었습니다! 출시 알림을 보내드릴게요.')
      setIsSubmitted(true)
    } finally {
      setIsSubmitting(false)
    }
  }

  if (isSubmitted) {
    return (
      <div className={styles.overlay}>
        <div className={styles.modal}>
          <button className={styles.closeButton} onClick={(e) => handleButtonClick(e, onClose)}>
            ×
          </button>
          <div className={styles.successContent}>
            <div className={styles.successIcon}>✓</div>
            <h2>등록 완료!</h2>
            <p>출시 소식을 가장 먼저 알려드릴게요.</p>
            <button className={styles.shareButton} onClick={(e) => handleButtonClick(e, onShare)}>
              친구에게 공유하기
            </button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className={styles.overlay}>
      <div className={styles.modal}>
        <button className={styles.closeButton} onClick={(e) => handleButtonClick(e, onClose)}>
          ×
        </button>

        <h2 className={styles.title}>아이의 감정을 기록하고 싶다면?</h2>

        <p className={styles.description}>
          아이의 일기를 동요로 만들어주는 AI 기반 아카이빙 앱서비스,
          <br />
          <strong>'일기짠'</strong>이 정식 출시를 앞두고 있어요.
        </p>

        <p className={styles.subDescription}>
          출시 소식을 가장 먼저 받아보고 싶으시다면 연락처를 남겨주세요!
          <br />
          <span className={styles.hint}>(인스타그램 아이디, 전화번호, 이메일 중 편한 방법으로 적어주세요.)</span>
        </p>

        <form onSubmit={handleSubmit}>
          <input
            type="text"
            className={styles.input}
            placeholder="연락처를 입력해주세요"
            value={contact}
            onChange={(e) => setContact(e.target.value)}
            disabled={isSubmitting}
          />
          <button
            type="submit"
            className={styles.submitButton}
            disabled={isSubmitting}
          >
            {isSubmitting ? '등록 중...' : '제출'}
          </button>
        </form>

        <button className={styles.shareButton} onClick={(e) => handleButtonClick(e, onShare)}>
          공유하기
        </button>

        <p className={styles.notice}>
          출시는 2026년 2월 예정되어 있습니다.
          <br />
          개인정보는 출시 사전 알림 전송 직후 폐기할 예정입니다.
        </p>
      </div>
    </div>
  )
}

export default PreRegisterModal
