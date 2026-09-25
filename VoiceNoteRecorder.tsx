import React, { useState, useEffect, useRef } from 'react';
import { Mic, Square, Play, Pause, Trash2, CheckCircle2 } from 'lucide-react';

interface VoiceNoteRecorderProps {
  onAudioRecorded?: (hasAudio: boolean) => void;
  accentColor?: string;
  label?: string;
}

export const VoiceNoteRecorder: React.FC<VoiceNoteRecorderProps> = ({
  onAudioRecorded,
  accentColor = '#00E5FF',
  label = 'آواز کا میسج ریکارڈ کریں (Voice Note for Fast Response)',
}) => {
  const [isRecording, setIsRecording] = useState(false);
  const [recordingSeconds, setRecordingSeconds] = useState(0);
  const [hasRecording, setHasRecording] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [playSeconds, setPlaySeconds] = useState(0);

  const timerRef = useRef<number | null>(null);

  useEffect(() => {
    if (isRecording) {
      timerRef.current = window.setInterval(() => {
        setRecordingSeconds((prev) => prev + 1);
      }, 1000);
    } else {
      if (timerRef.current) clearInterval(timerRef.current);
    }
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [isRecording]);

  useEffect(() => {
    let playTimer: number | null = null;
    if (isPlaying) {
      playTimer = window.setInterval(() => {
        setPlaySeconds((prev) => {
          if (prev >= recordingSeconds) {
            setIsPlaying(false);
            return 0;
          }
          return prev + 1;
        });
      }, 1000);
    }
    return () => {
      if (playTimer) clearInterval(playTimer);
    };
  }, [isPlaying, recordingSeconds]);

  const startRecording = () => {
    setRecordingSeconds(0);
    setHasRecording(false);
    setIsRecording(true);
  };

  const stopRecording = () => {
    setIsRecording(false);
    setHasRecording(true);
    onAudioRecorded?.(true);
  };

  const deleteRecording = () => {
    setIsRecording(false);
    setHasRecording(false);
    setIsPlaying(false);
    setRecordingSeconds(0);
    setPlaySeconds(0);
    onAudioRecorded?.(false);
  };

  const formatTime = (secs: number) => {
    const m = Math.floor(secs / 60);
    const s = secs % 60;
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  return (
    <div className="w-full bg-white/[0.03] border border-white/10 rounded-xl p-3">
      <div className="text-xs text-slate-300 font-medium mb-2 flex items-center justify-between">
        <span>{label}</span>
        {hasRecording && (
          <span className="text-[11px] text-emerald-400 flex items-center gap-1 font-sans">
            <CheckCircle2 className="w-3.5 h-3.5" />
            ریکارڈ محفوظ
          </span>
        )}
      </div>

      {!hasRecording && !isRecording && (
        <button
          type="button"
          onClick={startRecording}
          className="w-full py-2.5 px-3 rounded-lg border border-dashed border-cyan-500/40 bg-cyan-500/5 hover:bg-cyan-500/10 text-cyan-300 text-xs flex items-center justify-center gap-2 cursor-pointer transition active:scale-98"
        >
          <div className="w-6 h-6 rounded-full bg-cyan-500/20 flex items-center justify-center">
            <Mic className="w-3.5 h-3.5 text-cyan-400" />
          </div>
          <span>آواز ریکارڈ کریں (مسئلہ بول کر بتائیں)</span>
        </button>
      )}

      {isRecording && (
        <div className="flex items-center justify-between gap-3 p-2 bg-rose-500/10 border border-rose-500/30 rounded-lg animate-pulse">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-rose-500 animate-ping" />
            <span className="text-xs font-mono text-rose-400 font-bold">
              {formatTime(recordingSeconds)}
            </span>
            <span className="text-[11px] text-slate-300">ریکارڈنگ جاری ہے...</span>
          </div>

          <button
            type="button"
            onClick={stopRecording}
            className="py-1 px-3 bg-rose-500 hover:bg-rose-600 text-white rounded text-xs font-semibold flex items-center gap-1 cursor-pointer"
          >
            <Square className="w-3 h-3" />
            مکمل کریں
          </button>
        </div>
      )}

      {hasRecording && (
        <div className="flex items-center justify-between gap-2 p-2 bg-white/5 border border-white/10 rounded-lg">
          <button
            type="button"
            onClick={() => setIsPlaying(!isPlaying)}
            className="w-8 h-8 rounded-full bg-cyan-500/20 hover:bg-cyan-500/30 text-cyan-300 flex items-center justify-center cursor-pointer"
          >
            {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4 translate-x-0.5" />}
          </button>

          {/* Simulated waveform bars */}
          <div className="flex-1 flex items-center gap-0.5 h-6 px-1">
            {[40, 70, 95, 60, 85, 30, 100, 45, 80, 65, 90, 50, 75, 40, 85, 60, 70, 90].map((h, i) => (
              <div
                key={i}
                className="flex-1 rounded-full transition-all duration-150"
                style={{
                  height: `${h}%`,
                  backgroundColor: isPlaying && (i / 18) <= (playSeconds / (recordingSeconds || 1))
                    ? accentColor
                    : 'rgba(255, 255, 255, 0.25)',
                }}
              />
            ))}
          </div>

          <span className="text-xs font-mono text-slate-400">
            {formatTime(isPlaying ? playSeconds : recordingSeconds)}
          </span>

          <button
            type="button"
            onClick={deleteRecording}
            className="p-1.5 text-slate-400 hover:text-rose-400 transition"
            title="Delete Voice Note"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      )}
    </div>
  );
};
