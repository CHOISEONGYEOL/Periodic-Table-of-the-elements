import { useState, useEffect, useRef } from 'react';
import type { GameMode } from '../types';
import { getSavedNickname, saveNickname } from '../utils/storage';

interface NicknameInputProps {
  onSubmit: (nickname: string) => void;
  onBack: () => void;
  mode: GameMode;
}

const modeNames: Record<GameMode, string> = {
  speed: '⚡ 스피드 모드',
  survival: '❤️ 서바이벌 모드',
  practice: '📖 연습 모드',
  test: '📝 TEST 모드',
};

export const NicknameInput = ({ onSubmit, onBack, mode }: NicknameInputProps) => {
  const [nickname, setNickname] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);

  // 이전에 입력한 닉네임 불러오기
  useEffect(() => {
    const saved = getSavedNickname();
    if (saved) {
      setNickname(saved);
    }
    // 입력창에 포커스
    inputRef.current?.focus();
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = nickname.trim();
    if (trimmed.length === 0) {
      inputRef.current?.focus();
      return;
    }
    // 닉네임 저장 (다음에 자동 입력)
    saveNickname(trimmed);
    onSubmit(trimmed);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    // 최대 8자 제한
    const value = e.target.value.slice(0, 8);
    setNickname(value);
  };

  // 키보드 단축키
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onBack();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onBack]);

  return (
    <div className="nickname-screen">
      <button className="back-button" onClick={onBack}>
        ← 뒤로
      </button>

      <div className="nickname-container">
        <div className="nickname-icon">🎮</div>
        <h1 className="nickname-title">명예의 전당에<br />이름을 올려보세요!</h1>
        <p className="nickname-mode">{modeNames[mode]}</p>

        <form onSubmit={handleSubmit} className="nickname-form">
          <input
            ref={inputRef}
            type="text"
            value={nickname}
            onChange={handleChange}
            placeholder="닉네임 입력"
            className="nickname-input"
            maxLength={8}
            autoComplete="off"
            spellCheck={false}
          />
          <div className="nickname-hint">최대 8자까지 입력 가능</div>

          <button
            type="submit"
            className="btn btn-primary btn-large nickname-submit"
            disabled={nickname.trim().length === 0}
          >
            🎯 게임 시작!
          </button>
        </form>

        <div className="nickname-shortcuts">
          <span>Enter: 시작</span>
          <span>ESC: 뒤로</span>
        </div>
      </div>
    </div>
  );
};
