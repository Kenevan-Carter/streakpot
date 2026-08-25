export function formatGameTime(
    startsAt
  ) {
    if (!startsAt) {
      return "TBD";
    }
  
    return new Date(
      startsAt
    ).toLocaleTimeString(
      "en-US",
      {
        day: "numeric",
        hour: "numeric",
        minute: "2-digit",
      }
    );
  }
  
  export function formatCountdown(
    difference
  ) {
    if (difference <= 0) {
      return "Contest Closed";
    }
  
    const days =
      Math.floor(
        difference /
        (1000 * 60 * 60 * 24)
      );
  
    const hours =
      Math.floor(
        (
          difference /
          (1000 * 60 * 60)
        ) % 24
      );
  
    const minutes =
      Math.floor(
        (
          difference /
          (1000 * 60)
        ) % 60
      );
  
    const seconds =
      Math.floor(
        (
          difference /
          1000
        ) % 60
      );
  
    let countdown =
      "Closes in ";
  
    if (days > 0) {
      countdown += `${days}d `;
    }
  
    if (
      hours > 0 ||
      days > 0
    ) {
      countdown += `${hours}h `;
    }
  
    countdown +=
      `${minutes}m ${seconds}s`;
  
    return countdown;
  }