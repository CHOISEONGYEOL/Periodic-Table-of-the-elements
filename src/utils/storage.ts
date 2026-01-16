import type { LeaderboardEntry, GameMode, StudyTopic } from '../types';

const STORAGE_KEY = 'periodic-quiz-leaderboard';
const NICKNAME_KEY = 'periodic-quiz-nickname';

export const getLeaderboard = (): LeaderboardEntry[] => {
  try {
    const data = localStorage.getItem(STORAGE_KEY);
    return data ? JSON.parse(data) : [];
  } catch {
    return [];
  }
};

export const saveScore = (entry: LeaderboardEntry): void => {
  const leaderboard = getLeaderboard();
  leaderboard.push(entry);

  // 점수 기준 내림차순 정렬 후 상위 100개만 유지
  leaderboard.sort((a, b) => b.score - a.score);
  const trimmed = leaderboard.slice(0, 100);

  localStorage.setItem(STORAGE_KEY, JSON.stringify(trimmed));
};

// 전체 기록 가져오기 (명예의 전당용) - topic과 mode로 필터링
export const getAllScores = (topic: StudyTopic, mode: GameMode): LeaderboardEntry[] => {
  const leaderboard = getLeaderboard();
  return leaderboard
    .filter(e => e.topic === topic && e.mode === mode)
    .sort((a, b) => b.score - a.score);
};

export const clearLeaderboard = (): void => {
  localStorage.removeItem(STORAGE_KEY);
};

// 닉네임 저장/불러오기
export const saveNickname = (nickname: string): void => {
  localStorage.setItem(NICKNAME_KEY, nickname);
};

export const getSavedNickname = (): string => {
  return localStorage.getItem(NICKNAME_KEY) || '';
};
