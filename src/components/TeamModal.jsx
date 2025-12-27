import { teamInfo } from '../data/teamInfo'
import styles from './TeamModal.module.css'

function TeamModal({ onClose }) {
  return (
    <div className={styles.overlay} onClick={onClose}>
      <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
        <button className={styles.closeButton} onClick={onClose}>
          ×
        </button>

        <h2 className={styles.title}>
          이 테스트를 만든 '<span>{teamInfo.name}</span>' 팀은요,
        </h2>

        <p className={styles.description}>{teamInfo.description}</p>

        <div className={styles.serviceSection}>
          <p>
            아이의 일기를 동요로 만들고, 아카이빙하는 AI기반 앱 서비스
            <strong> '{teamInfo.service.name}'</strong>을 개발 중이며,
            <br />
            {teamInfo.service.launchDate} 정식 출시를 목표로 하고 있어요.
          </p>
        </div>

        <div className={styles.infoBox}>
          <p className={styles.infoLabel}>
            💡 현재 보고 계신 테스트는 정식 출시 전, 미리 체험해보실 수 있는 아이 기질 테스트예요.
          </p>
        </div>

        <div className={styles.section}>
          <h3>{teamInfo.service.name}은 어떤 서비스인가요?</h3>
          <ul>
            {teamInfo.service.features.map((feature, index) => (
              <li key={index}>{feature}</li>
            ))}
          </ul>
        </div>

        <div className={styles.section}>
          <h3>팀 소개</h3>
          <ul>
            {teamInfo.achievements.map((achievement, index) => (
              <li key={index}>{achievement}</li>
            ))}
          </ul>
          <p className={styles.mission}>{teamInfo.mission}</p>
        </div>
      </div>
    </div>
  )
}

export default TeamModal
