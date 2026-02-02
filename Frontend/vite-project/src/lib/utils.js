 export function formatMessageTime(date) {
  return new Date(date).toLocaleTimeString("en-US", {
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  });
}

export function formatLastSeen(date) {
  if (!date) return "";
  const lastSeenDate = new Date(date);
  return `Last seen ${lastSeenDate.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
  })} ${lastSeenDate.toLocaleTimeString("en-US", {
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  })}`;
}
