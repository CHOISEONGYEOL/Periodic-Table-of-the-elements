import { useState } from 'react';
import type { GameMode, StudyTopic } from '../types';
import { getAllScores } from '../utils/storage';

interface LeaderboardProps {
  topic: StudyTopic;  // 분야 (주기율표, 화학식, 계수, 분자)
  mode: GameMode;
  currentNickname?: string;  // 현재 플레이어 닉네임 (하이라이트용)
}

export const Leaderboard = ({ topic, mode, currentNickname }: LeaderboardProps) => {
  const [showAll, setShowAll] = useState(false);
  const allScores = getAllScores(topic, mode);

  if (allScores.length === 0) {
    return (
      <div className="hall-of-fame">
        <h3 className="hall-title">🏆 명예의 전당 🏆</h3>
        <div className="hall-empty">
          아직 기록이 없습니다.<br />
          첫 번째 영웅이 되어보세요!
        </div>
      </div>
    );
  }

  // 날짜 포맷: YYYY/MM/DD HH:mm
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    const hours = String(date.getHours()).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');
    return `${year}/${month}/${day} ${hours}:${minutes}`;
  };

  // 점수 포맷: 천 단위 콤마
  const formatScore = (score: number) => {
    return score.toLocaleString();
  };

  // 랭크 이모지
  const getRankDisplay = (index: number) => {
    if (index === 0) return '🥇';
    if (index === 1) return '🥈';
    if (index === 2) return '🥉';
    return `${index + 1}.`;
  };

  const top10 = allScores.slice(0, 10);
  const rest = allScores.slice(10);

  return (
    <div className="hall-of-fame">
      <h3 className="hall-title">🏆 명예의 전당 🏆</h3>

      <div className="hall-list">
        {/* TOP 10 */}
        {top10.map((entry, index) => (
          <div
            key={`top-${index}`}
            className={`hall-entry ${index < 3 ? 'top-3' : ''} ${entry.nickname === currentNickname ? 'current-player' : ''}`}
          >
            <span className="hall-rank">{getRankDisplay(index)}</span>
            <span className="hall-nickname">{entry.nickname || 'AAA'}</span>
            <span className="hall-score">{formatScore(entry.score)}점</span>
            <span className="hall-date">{formatDate(entry.date)}</span>
          </div>
        ))}

        {/* 더보기 버튼 & 나머지 기록 */}
        {rest.length > 0 && (
          <>
            <button
              className="hall-expand-btn"
              onClick={() => setShowAll(!showAll)}
            >
              {showAll ? '▲ 접기' : `▼ 더보기 (${rest.length}개)`}
            </button>

            {showAll && (
              <div className="hall-rest">
                {rest.map((entry, index) => (
                  <div
                    key={`rest-${index}`}
                    className={`hall-entry ${entry.nickname === currentNickname ? 'current-player' : ''}`}
                  >
                    <span className="hall-rank">{index + 11}.</span>
                    <span className="hall-nickname">{entry.nickname || 'AAA'}</span>
                    <span className="hall-score">{formatScore(entry.score)}점</span>
                    <span className="hall-date">{formatDate(entry.date)}</span>
                  </div>
                ))}
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};
