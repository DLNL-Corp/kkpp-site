import { useState, useRef, useEffect } from 'react'
import styles from './ResultPage.module.css'
import PreRegisterModal from '../components/PreRegisterModal'

function ResultPage({ result, onRestart, onShowTeam }) {
  const [activeTab, setActiveTab] = useState('result') // result, lyrics
  const [isPlaying, setIsPlaying] = useState(false)
  const [currentTime, setCurrentTime] = useState(0)
  const [duration, setDuration] = useState(0)
  const [showPreRegister, setShowPreRegister] = useState(false)
  const [hasShownModal, setHasShownModal] = useState(false)
  const [hasScrolledToBottom, setHasScrolledToBottom] = useState(false)
  const audioRef = useRef(null)

  useEffect(() => {
    const handleScroll = () => {
      const scrollTop = window.scrollY || document.documentElement.scrollTop
      const scrollHeight = document.documentElement.scrollHeight
      const clientHeight = window.innerHeight

      if (scrollTop + clientHeight >= scrollHeight - 150 && !hasScrolledToBottom) {
        setHasScrolledToBottom(true)
        if (!hasShownModal) {
          setTimeout(() => setShowPreRegister(true), 500)
        }
      }
    }

    const checkNoScroll = () => {
      const scrollHeight = document.documentElement.scrollHeight
      const clientHeight = window.innerHeight
      if (scrollHeight <= clientHeight + 50 && !hasScrolledToBottom) {
        setTimeout(() => {
          if (!hasScrolledToBottom && !hasShownModal) {
            setHasScrolledToBottom(true)
            setShowPreRegister(true)
          }
        }, 3000)
      }
    }

    window.addEventListener('scroll', handleScroll)
    setTimeout(checkNoScroll, 1000)

    return () => window.removeEventListener('scroll', handleScroll)
  }, [hasScrolledToBottom, hasShownModal])

  const togglePlay = (e) => {
    e.currentTarget.blur()
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.pause()
      } else {
        audioRef.current.play()
      }
      setIsPlaying(!isPlaying)
    }
  }

  const handleTimeUpdate = () => {
    if (audioRef.current) {
      setCurrentTime(audioRef.current.currentTime)
    }
  }

  const handleLoadedMetadata = () => {
    if (audioRef.current) {
      setDuration(audioRef.current.duration)
    }
  }

  const handleAudioEnd = () => {
    setIsPlaying(false)
    setCurrentTime(0)
  }

  const handleProgressClick = (e) => {
    if (audioRef.current && duration) {
      const rect = e.currentTarget.getBoundingClientRect()
      const x = e.clientX - rect.left
      const percentage = x / rect.width
      audioRef.current.currentTime = percentage * duration
    }
  }

  const handleShare = async () => {
    const url = window.location.href
    try {
      await navigator.clipboard.writeText(url)
      alert('링크가 복사되었습니다!')
    } catch (err) {
      const textArea = document.createElement('textarea')
      textArea.value = url
      document.body.appendChild(textArea)
      textArea.select()
      document.execCommand('copy')
      document.body.removeChild(textArea)
      alert('링크가 복사되었습니다!')
    }
  }

  const handleCloseModal = () => {
    setShowPreRegister(false)
    setHasShownModal(true)
  }

  const handleOpenPreRegister = () => {
    setShowPreRegister(true)
  }

  const handleButtonClick = (e, callback) => {
    e.currentTarget.blur()
    callback()
  }

  const difficultyColors = {
    '상': '#FF6B6B',
    '중': '#FFB84D',
    '하': '#4ECDC4'
  }

  const progress = duration ? (currentTime / duration) * 100 : 0

  return (
    <div className={styles.container}>
      <button className={styles.teamButton} onClick={(e) => handleButtonClick(e, onShowTeam)} aria-label="팀 소개">
        ?
      </button>

      <audio
        ref={audioRef}
        src={result.audio}
        onEnded={handleAudioEnd}
        onTimeUpdate={handleTimeUpdate}
        onLoadedMetadata={handleLoadedMetadata}
      />

      {/* 상단 텍스트 */}
      <div className={styles.headerSection}>
        <p className={styles.resultIntro}>우리 아이는</p>
        <h1 className={styles.resultTitle}>{result.title}!</h1>
      </div>

      {/* 앨범 커버 (크게) */}
      <div className={styles.albumSection}>
        <div className={styles.albumCover}>
          <img src={result.albumCover} alt="앨범 커버" />
        </div>
        <p className={styles.albumTitle}>{result.title}</p>
      </div>

      {/* 재생 컨트롤 (별도) */}
      <div className={styles.playerControls}>
        <div className={styles.progressBarWrapper} onClick={handleProgressClick}>
          <div className={styles.progressBar}>
            <div
              className={styles.progressFill}
              style={{ width: `${progress}%` }}
            />
            <div
              className={styles.progressThumb}
              style={{ left: `${progress}%` }}
            />
          </div>
        </div>
        <button className={styles.playButton} onClick={togglePlay}>
          {isPlaying ? (
            <svg viewBox="0 0 24 24" fill="currentColor">
              <rect x="6" y="4" width="4" height="16" />
              <rect x="14" y="4" width="4" height="16" />
            </svg>
          ) : (
            <svg viewBox="0 0 24 24" fill="currentColor">
              <path d="M8 5v14l11-7z" />
            </svg>
          )}
        </button>
      </div>

      {/* 탭 */}
      <div className={styles.tabs}>
        <button
          className={`${styles.tab} ${activeTab === 'result' ? styles.active : ''}`}
          onClick={(e) => { e.currentTarget.blur(); setActiveTab('result') }}
        >
          결과 해설
        </button>
        <button
          className={`${styles.tab} ${activeTab === 'lyrics' ? styles.active : ''}`}
          onClick={(e) => { e.currentTarget.blur(); setActiveTab('lyrics') }}
        >
          가사 보기
        </button>
      </div>

      {/* 탭 콘텐츠 */}
      <div className={styles.tabContent}>
        {activeTab === 'result' ? (
          <>
            <div className={styles.section}>
              <h3 className={styles.sectionTitle}>평소에 이런 모습이에요</h3>
              <ul className={styles.traitsList}>
                {result.traits.map((trait, index) => (
                  <li key={index}>{trait}</li>
                ))}
              </ul>
            </div>

            <div className={styles.section}>
              <h3 className={styles.sectionTitle}>부모님이 느끼는 육아 난이도</h3>
              <div
                className={styles.difficultyBadge}
                style={{ backgroundColor: difficultyColors[result.difficulty] }}
              >
                육아 난이도: {result.difficulty}
              </div>
              <p className={styles.description}>{result.parentComment}</p>
            </div>

            <div className={styles.section}>
              <h3 className={styles.sectionTitle}>우리 아이에게 딱 맞는 기록 방법</h3>
              <p className={styles.description}>{result.recordingTip}</p>
            </div>
          </>
        ) : (
          <div className={styles.lyricsSection}>
            <pre className={styles.lyrics}>{result.lyrics}</pre>
          </div>
        )}
      </div>

      {/* 하단 버튼 (모달 닫은 후 표시) */}
      {hasShownModal && (
        <div className={styles.bottomButtons}>
          <button className={styles.bottomButton} onClick={(e) => { e.currentTarget.blur(); handleOpenPreRegister() }}>
            사전 알림 등록하기
          </button>
          <button className={styles.bottomButtonSecondary} onClick={(e) => { e.currentTarget.blur(); handleShare() }}>
            공유하기
          </button>
        </div>
      )}

      {/* 하단 여백 */}
      <div className={styles.bottomSpacer} />

      {/* 사전등록 모달 */}
      {showPreRegister && (
        <PreRegisterModal
          onClose={handleCloseModal}
          onShare={handleShare}
        />
      )}
    </div>
  )
}

export default ResultPage
