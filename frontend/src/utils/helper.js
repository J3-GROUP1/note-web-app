export const validateEmail = (email) => {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
  };
  
  export const removeError = () => {
    setTimeout(() => {
      setError("");
    }, 3000);
  };
  
  export const getInitials = (name) => {
    if (!name) {
      return "";
    }
  
    const words = name.split(" ");
    const initials = words.map((item) => item.charAt(0)).join("");
  
    return initials.toUpperCase();
  };