export function useLocalStorage(key, initialValue = "") {
  const setValue = (value) => {
   try{
   localStorage.setItem(key, JSON.stringify(value));
   }catch(error){
    console.error("error setting localStorage:",error)
   }
    
  };

  const getValue = () => {
    try {
 const storedValue = localStorage.getItem(key);
    return storedValue ? JSON.parse(storedValue) : initialValue;
    } catch(error){
      console.error("error getting localStorage:",error);
      return initialValue;
    }
  };

  return[getValue,setValue];
}
