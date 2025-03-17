
const FormatDate = (dateString) => {
    const date = new Date(dateString);
    let hours = date.getHours();
    const minutes = date.getMinutes();
    const ampm = hours >= 12 ? "pm" : "am";
    hours = hours % 12;
    hours = hours ? hours : 12; // convert '0' hour to '12'
    const minutesStr = minutes < 10 ? `0${minutes}` : minutes;
    const month = date.toLocaleString("default", { month: "long" });
    const day = date.getDate();
    const year = date.getFullYear();
    return `${hours}:${minutesStr}${ampm} ${month} ${day}, ${year}`;
  };
  export default FormatDate;