import { useMemo, useState } from 'react'
import styles from './QuestionPage.module.css'

function QuestionPage({
  question,
  questionNumber,
  totalQuestions,
  onAnswer,
  onPrevious,
  canGoPrevious
}) {
  const [selectedOption, setSelectedOption] = useState(null)

  // 선택지 랜덤 순서로 섞기
  const shuffledOptions = useMemo(() => {
    const options = [...question.options]
    for (let i = options.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [options[i], options[j]] = [options[j], options[i]]
    }
    return options
  }, [question.id])

  const handleSelect = (e, type) => {
    e.currentTarget.blur() // 포커스 해제
    setSelectedOption(type)
    setTimeout(() => {
      onAnswer(type)
      setSelectedOption(null)
    }, 300)
  }

  const handlePrevious = (e) => {
    e.currentTarget.blur()
    onPrevious()
  }

  const progress = (questionNumber / totalQuestions) * 100

  return (
    <div className={styles.container}>
      <div className={styles.progressBarWrapper}>
        <div className={styles.progressBar}>
          <div
            className={styles.progressFill}
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>

      <div className={styles.content}>
        <h2 className={styles.questionNumber}>Q{questionNumber}.</h2>
        <p className={styles.questionText}>{question.question}</p>

        <div className={styles.options}>
          {shuffledOptions.map((option, index) => (
            <button
              key={option.type}
              className={`${styles.option} ${selectedOption === option.type ? styles.selected : ''}`}
              onClick={(e) => handleSelect(e, option.type)}
            >
              {option.text}
            </button>
          ))}
        </div>
      </div>

      {canGoPrevious && (
        <button className={styles.prevButton} onClick={handlePrevious}>
          이전
        </button>
      )}
    </div>
  )
}

export default QuestionPage
