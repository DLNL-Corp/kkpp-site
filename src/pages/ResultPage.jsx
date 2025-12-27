import { useState, useRef, useEffect } from 'react'
import styles from './ResultPage.module.css'
import PreRegisterModal from '../components/PreRegisterModal'

function ResultPage({ result, onRestart, onShowTeam }) {
  const [activeTab, setActiveTab] = useState('result') // result, lyrics
  const [isPlaying, setIsPlaying] = useState(false)
  const [showPreRegister, setShowPreRegister] = useState(false)
  const [hasScrolledToBottom, setHasScrolledToBottom] = useState(false)
  const audioRef = useRef(null)
  const containerRef = useRef(null)

  useEffect(() => {
    const handleScroll = () => {
      // window 스크롤 체크
      const scrollTop = window.scrollY || document.documentElement.scrollTop
      const scrollHeight = document.documentElement.scrollHeight
      const clientHeight = window.innerHeight

      if (scrollTop + clientHeight >= scrollHeight - 150 && !hasScrolledToBottom) {
        setHasScrolledToBottom(true)
        setTimeout(() => setShowPreRegister(true), 500)
      }
    }

    // 콘텐츠가 짧아서 스크롤이 없는 경우 체크
    const checkNoScroll = () => {
      const scrollHeight = document.documentElement.scrollHeight
      const clientHeight = window.innerHeight
      if (scrollHeight <= clientHeight + 50 && !hasScrolledToBottom) {
        // 스크롤이 거의 없으면 3초 후 자동으로 모달 표시
        setTimeout(() => {
          if (!hasScrolledToBottom) {
            setHasScrolledToBottom(true)
            setShowPreRegister(true)
          }
        }, 3000)
      }
    }

    window.addEventListener('scroll', handleScroll)
    // 페이지 로드 후 스크롤 여부 체크
    setTimeout(checkNoScroll, 1000)

    return () => window.removeEventListener('scroll', handleScroll)
  }, [hasScrolledToBottom])

  const togglePlay = () => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.pause()
      } else {
        audioRef.current.play()
      }
      setIsPlaying(!isPlaying)
    }
  }

  const handleAudioEnd = () => {
    setIsPlaying(false)
  }

  const handleShare = async () => {
    const url = window.location.href
    try {
      await navigator.clipboard.writeText(url)
      alert('링크가 복사되었습니다!')
    } catch (err) {
      // Fallback for older browsers
      const textArea = document.createElement('textarea')
      textArea.value = url
      document.body.appendChild(textArea)
      textArea.select()
      document.execCommand('copy')
      document.body.removeChild(textArea)
      alert('링크가 복사되었습니다!')
    }
  }

  const difficultyColors = {
    '상': '#FF6B6B',
    '중': '#FFB84D',
    '하': '#4ECDC4'
  }

  return (
    <div className={styles.container} ref={containerRef}>
      <button className={styles.teamButton} onClick={onShowTeam} aria-label="팀 소개">
        ?
      </button>

      <audio ref={audioRef} src={result.audio} onEnded={handleAudioEnd} />

      {/* 캐릭터 섹션 */}
      <div className={styles.characterSection}>
        <p className={styles.resultIntro}>우리 아이는</p>
        <h1 className={styles.resultTitle}>{result.title}!</h1>
        <img
          src={result.character}
          alt={result.title}
          className={styles.characterImage}
        />
      </div>

      {/* 앨범 커버 + 플레이어 */}
      <div className={styles.playerSection}>
        <div className={styles.albumCover}>
          <img src={result.albumCover} alt="앨범 커버" />
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
        <p className={styles.albumTitle}>{result.title}</p>
      </div>

      {/* 탭 */}
      <div className={styles.tabs}>
        <button
          className={`${styles.tab} ${activeTab === 'result' ? styles.active : ''}`}
          onClick={() => setActiveTab('result')}
        >
          결과 해설
        </button>
        <button
          className={`${styles.tab} ${activeTab === 'lyrics' ? styles.active : ''}`}
          onClick={() => setActiveTab('lyrics')}
        >
          가사 보기
        </button>
      </div>

      {/* 탭 콘텐츠 */}
      <div className={styles.tabContent}>
        {activeTab === 'result' ? (
          <>
            {/* 특성 */}
            <div className={styles.section}>
              <h3 className={styles.sectionTitle}>평소에 이런 모습이에요</h3>
              <ul className={styles.traitsList}>
                {result.traits.map((trait, index) => (
                  <li key={index}>{trait}</li>
                ))}
              </ul>
            </div>

            {/* 육아 난이도 */}
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

            {/* 기록 방법 */}
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

      {/* 하단 여백 (스크롤용) */}
      <div className={styles.bottomSpacer} />

      {/* 사전등록 모달 */}
      {showPreRegister && (
        <PreRegisterModal
          onClose={() => setShowPreRegister(false)}
          onShare={handleShare}
        />
      )}
    </div>
  )
}

export default ResultPage
