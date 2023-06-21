import { useEffect, useState } from "react";

interface Props {
  text: {
    front: string;
    back: string;
  };
}

const Flashcard: React.FC<Props> = ({ text }) => {
  const [frontIsVisible, setFrontIsVisible] = useState<boolean>(true);

  useEffect(() => {
    setFrontIsVisible(true);
  }, [text]);

  return (
    <div
      className="w-80 h-40 py-12 select-none rounded-lg flex justify-center items-center hover:cursor-pointer bg-indigo-500 hover:rounded-lg hover:bg-indigo-600 text-white hover:text-white "
      onClick={() => setFrontIsVisible(!frontIsVisible)}
    >
      {frontIsVisible ? text.front : text.back}
    </div>
  );
};

export default Flashcard;
