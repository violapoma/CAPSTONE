import { createContext, useContext, useState } from "react";

const LoaderSignUp = createContext();

export function LoaderSignUpProvider({children}){
  const [signUpLoader, setSignUpLoader] = useState(false); 
  return (
    <LoaderSignUp.Provider value={{signUpLoader, setSignUpLoader}}>
      {children}
    </LoaderSignUp.Provider>
  )
}

export function useSignUpLoaderProvider(){
  return useContext(LoaderSignUp); 
}