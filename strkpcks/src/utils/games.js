export function getSportDisplayName(
    selectedSport
  ) {
    switch (selectedSport) {
      case "NBA":
        return "BASKETBALL";
  
      case "NFL":
        return "FOOTBALL";
  
      case "MLB":
        return "BASEBALL";
  
      case "NHL":
        return "HOCKEY";
  
      case "EPL":
        return "EPL";
  
      default:
        return selectedSport;
    }
  }