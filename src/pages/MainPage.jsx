import styles from './MainPage.module.css'

function MainPage({ onStart, onShowTeam }) {
  const handleButtonClick = (e, callback) => {
    e.currentTarget.blur()
    callback()
  }

  return (
    <div className={styles.container}>
      <button className={styles.teamButton} onClick={(e) => handleButtonClick(e, onShowTeam)} aria-label="팀 소개">
        ?
      </button>

      <div className={styles.characters}>
        <img
          src="/images/characters/높은음(파랑).png"
          alt="파랑 캐릭터"
          className={styles.character}
        />
        <img
          src="/images/characters/낮은음(초록).png"
          alt="초록 캐릭터"
          className={styles.character}
        />
        <img
          src="/images/characters/음표(보라).png"
          alt="보라 캐릭터"
          className={styles.character}
        />
      </div>

      <h1 className={styles.title}>우리 아이</h1>
      <h2 className={styles.subtitle}>육아 난이도 테스트</h2>
      <p className={styles.description}>3분이면 알 수 있는 우리 아이 기질 테스트</p>

      <button className={styles.startButton} onClick={(e) => handleButtonClick(e, onStart)}>
        테스트 시작하기
      </button>
    </div>
  )
}

export default MainPage
