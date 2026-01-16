import type { GameState, QuizCategory, StudyTopic } from '../types';
import { Leaderboard } from './Leaderboard';

const categoryNames: Record<QuizCategory, string> = {
  all: '전체 문제',
  name: '원소 이름',
  number: '원자 번호',
  valence: '원자가',
};

interface ResultProps {
  gameState: GameState;
  topic: StudyTopic;  // 분야 추가
  onRestart: () => void;
  onHome: () => void;
}

export const Result = ({ gameState, topic, onRestart, onHome }: ResultProps) => {
  const { mode, category, score, correctCount, wrongCount, maxCombo, hintsUsed } = gameState;
  const totalQuestions = correctCount + wrongCount;
  const accuracy = totalQuestions > 0
    ? Math.round((correctCount / totalQuestions) * 100)
    : 0;

  // 전체 카테고리 + 스피드/서바이벌 모드일 때만 명예의 전당 표시
  const showLeaderboard = category === 'all' && (mode === 'speed' || mode === 'survival');

  return (
    <div className="result">
      <div className="result-header">
        <h1>게임 종료!</h1>
        <p className="game-mode">
          {mode === 'speed' ? '⚡ 스피드 모드' : '❤️ 서바이벌 모드'}
          <span className="category-tag">{categoryNames[category]}</span>
        </p>
      </div>

      <div className="stats">
        <div className="stat-item main-stat">
          <span className="stat-value">{score.toLocaleString()}</span>
          <span className="stat-label">총 점수</span>
        </div>

        <div className="stat-grid">
          <div className="stat-item">
            <span className="stat-value">{correctCount}</span>
            <span className="stat-label">정답</span>
          </div>
          <div className="stat-item">
            <span className="stat-value">{wrongCount}</span>
            <span className="stat-label">오답</span>
          </div>
          <div className="stat-item">
            <span className="stat-value">{accuracy}%</span>
            <span className="stat-label">정확도</span>
          </div>
          <div className="stat-item">
            <span className="stat-value">{maxCombo}</span>
            <span className="stat-label">최대 콤보</span>
          </div>
        </div>

        {hintsUsed > 0 && (
          <div className="hints-used">
            💡 힌트 사용: {hintsUsed}회
          </div>
        )}
      </div>

      {showLeaderboard && (
        <Leaderboard topic={topic} mode={mode} currentNickname={gameState.nickname} />
      )}

      <div className="result-actions">
        <button className="btn btn-primary" onClick={onRestart}>
          다시 하기
        </button>
        <button className="btn btn-secondary" onClick={onHome}>
          홈으로
        </button>
      </div>
    </div>
  );
};
