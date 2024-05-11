import React, { useState } from 'react';

interface modalProps {
    message: string;
    title: string;
    onResultChange: (val : boolean) => void;
}
const FailedModal = ({onResultChange ,message, title}:modalProps) => {
    // const [result, setResult] = useState(true);
    const [visible, setVisible] = useState(true);
    const handleResultChange = () => {
        setVisible(false)
        const timeoutId = setTimeout(function callbackFunction() {
            onResultChange(false);
            setVisible(true)
        }, 300);
       
    };
    return (
      <div className={`${visible ? 'opacity-100 transition-all ease-linear duration-300' : 'opacity-0 transition-all ease-linear duration-150'}`}>
            <div
                className="fixed inset-0 p-4 flex flex-wrap justify-center items-center w-full h-full before:fixed before:inset-0 before:w-full before:h-full before:bg-[rgba(0,0,0,0.5)] overflow-auto font-[sans-serif]">
                <div className="w-full max-w-lg bg-white shadow-lg rounded-md p-6 relative">
                <svg xmlns="http://www.w3.org/2000/svg"
                    className="w-3.5 cursor-pointer shrink-0 fill-[#aaadd6] hover:fill-red-500 float-right" viewBox="0 0 320.591 320.591" onClick={handleResultChange}>
                    <path
                    d="M30.391 318.583a30.37 30.37 0 0 1-21.56-7.288c-11.774-11.844-11.774-30.973 0-42.817L266.643 10.665c12.246-11.459 31.462-10.822 42.921 1.424 10.362 11.074 10.966 28.095 1.414 39.875L51.647 311.295a30.366 30.366 0 0 1-21.256 7.288z"
                    data-original="#000000"></path>
                    <path
                    d="M287.9 318.583a30.37 30.37 0 0 1-21.257-8.806L8.83 51.963C-2.078 39.225-.595 20.055 12.143 9.146c11.369-9.736 28.136-9.736 39.504 0l259.331 257.813c12.243 11.462 12.876 30.679 1.414 42.922-.456.487-.927.958-1.414 1.414a30.368 30.368 0 0 1-23.078 7.288z"
                    data-original="#000000"></path>
                </svg>
                <div className="my-8 text-center">
                <svg className="animate-[bounce_2s_ease-in-out_infinite]  inline w-16 h-16 text-red-600 dark:text-white" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="currentColor" viewBox="0 0 24 24">
                <path d="M18 17h-.09c.058-.33.088-.665.09-1v-1h1a1 1 0 0 0 0-2h-1.09a5.97 5.97 0 0 0-.26-1H17a2 2 0 0 0 2-2V8a1 1 0 1 0-2 0v2h-.54a6.239 6.239 0 0 0-.46-.46V8a3.963 3.963 0 0 0-.986-2.6l.693-.693A1 1 0 0 0 16 4V3a1 1 0 1 0-2 0v.586l-.661.661a3.753 3.753 0 0 0-2.678 0L10 3.586V3a1 1 0 1 0-2 0v1a1 1 0 0 0 .293.707l.693.693A3.963 3.963 0 0 0 8 8v1.54a6.239 6.239 0 0 0-.46.46H7V8a1 1 0 0 0-2 0v2a2 2 0 0 0 2 2h-.65a5.97 5.97 0 0 0-.26 1H5a1 1 0 0 0 0 2h1v1a6 6 0 0 0 .09 1H6a2 2 0 0 0-2 2v2a1 1 0 1 0 2 0v-2h.812A6.012 6.012 0 0 0 11 21.907V12a1 1 0 0 1 2 0v9.907A6.011 6.011 0 0 0 17.188 19H18v2a1 1 0 0 0 2 0v-2a2 2 0 0 0-2-2Zm-4-8.65a5.922 5.922 0 0 0-.941-.251l-.111-.017a5.52 5.52 0 0 0-1.9 0l-.111.017A5.925 5.925 0 0 0 10 8.35V8a2 2 0 1 1 4 0v.35Z"/>
                </svg>
                    <h4 className="text-2xl text-[#333] font-semibold mt-6">{title}</h4>
                    <p className="text-sm text-gray-500 mt-4">{message}</p>
                </div>
                <button type="button"
                    className="px-6 py-2.5 min-w-[150px] w-full rounded text-white text-sm font-semibold border-none outline-none bg-red-600 hover:bg-red-800" onClick={handleResultChange}>Ok</button>
                </div>
            </div>
        </div>
    );
};

export default FailedModal;