import { create } from "zustand";
import toast from "react-hot-toast";

export const useCallStore = create((set, get) => ({
  // Call State
  isCallActive: false,
  callType: null, // "voice" | "video"
  callDuration: 0,
  callStatus: "idle", // "ringing" | "connected" | "ended"
  remoteUserId: null,
  isMicMuted: false,
  isCameraMuted: false,
  
  // Media Streams
  localStream: null,
  remoteStream: null,
  
  // Call Actions
  startCall: (userId, type) => {
    set({
      isCallActive: true,
      callType: type,
      remoteUserId: userId,
      callStatus: "ringing",
      callDuration: 0,
    });
    toast.success(`${type === "video" ? "📹" : "📞"} ${type} call started`);
  },

  acceptCall: () => {
    set({ callStatus: "connected" });
    toast.success("Call connected");
  },

  rejectCall: () => {
    set({
      isCallActive: false,
      callStatus: "idle",
      callType: null,
      remoteUserId: null,
    });
    toast.info("Call rejected");
  },

  endCall: () => {
    const { localStream, remoteStream } = get();
    
    // Stop all tracks
    if (localStream) {
      localStream.getTracks().forEach((track) => track.stop());
    }
    if (remoteStream) {
      remoteStream.getTracks().forEach((track) => track.stop());
    }

    set({
      isCallActive: false,
      callStatus: "ended",
      callType: null,
      remoteUserId: null,
      localStream: null,
      remoteStream: null,
      isMicMuted: false,
      isCameraMuted: false,
      callDuration: 0,
    });
    toast.success("Call ended");
  },

  toggleMic: () => {
    const { localStream, isMicMuted } = get();
    if (localStream) {
      localStream.getAudioTracks().forEach((track) => {
        track.enabled = isMicMuted;
      });
      set({ isMicMuted: !isMicMuted });
      toast.success(isMicMuted ? "Mic on" : "Mic muted");
    }
  },

  toggleCamera: () => {
    const { localStream, isCameraMuted } = get();
    if (localStream) {
      localStream.getVideoTracks().forEach((track) => {
        track.enabled = isCameraMuted;
      });
      set({ isCameraMuted: !isCameraMuted });
      toast.success(isCameraMuted ? "Camera on" : "Camera off");
    }
  },

  setLocalStream: (stream) => {
    set({ localStream: stream });
  },

  setRemoteStream: (stream) => {
    set({ remoteStream: stream });
  },

  incrementCallDuration: () => {
    set((state) => ({
      callDuration: state.callDuration + 1,
    }));
  },

  resetCall: () => {
    set({
      isCallActive: false,
      callType: null,
      callDuration: 0,
      callStatus: "idle",
      remoteUserId: null,
      isMicMuted: false,
      isCameraMuted: false,
      localStream: null,
      remoteStream: null,
    });
  },
}));

