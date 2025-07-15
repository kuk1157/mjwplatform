import { ChangeEvent } from "react";
import { TextEditor } from "../molecules/textEditor";

const DetailForm = ({
    title,
    setTitle,
    content,
    setContent,
    thumbnail,
    handleInputChange,
    // selectRow,
    // onSave,
    // onDelete,
}: {
    title: string;
    setTitle: (title: string) => void;
    content: string;
    setContent: (content: string) => void;
    thumbnail?: string;
    handleInputChange?: (
        e: React.ChangeEvent<
            HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
        >
    ) => void;
    // selectRow?: {};
    // onSave: () => Promise<void>;
    // onDelete: () => Promise<void>;
}) => {
    return (
        <>
            <div className="flex flex-col gap-5 mt-10">
                <div>
                    <p className="text-base font-semibold mb-[10px]">제목</p>
                    <input
                        type="text"
                        className="w-full p-2 bg-gray-100 rounded-md"
                        value={title || ""}
                        onChange={(e: ChangeEvent<HTMLInputElement>) =>
                            setTitle && setTitle(e.target.value)
                        }
                    />
                </div>
                <div>
                    <p className="text-base font-semibold mb-[10px]">
                        상세내용
                    </p>
                    <TextEditor content={content} setContent={setContent} />
                </div>
                {handleInputChange && (
                    <div className="w-full flex py-4 border-b border-[#f3f3f3] lg:text-sm xs:text-[13px] xs:flex-col mt-[50px] gap-[20px]">
                        <p className="text-base font-semibold mb-[10px] text-nowrap">
                            썸네일
                        </p>
                        <div className="flex w-full flex-col xs:ml-6 xs:mt-5">
                            <input
                                type="file"
                                className="w-full border-b border-[#D6D6D6] rounded-[5px] max-w-[800px] px-4 pb-2"
                                onChange={handleInputChange}
                                accept="image/*"
                            />
                            {thumbnail && (
                                <img
                                    src={thumbnail}
                                    alt=""
                                    className="w-[400px] h-[300px] aspect-auto object-contain"
                                />
                            )}
                            {/* presigned url 기능 주석 */}
                            {/* {thumbnail === "/assets/image/time.png" ? (
                                <span className="mt-5">유효기간 만료</span>
                            ) : (
                                <a
                                    className="w-36 border border-black rounded py-3 text-center mt-5"
                                    href={thumbnail}
                                    download
                                >
                                    이미지 다운로드
                                </a>
                            )} */}
                        </div>
                    </div>
                )}
                {/* 임시 주석 */}
                {/* <div className="text-center mt-[52px]">
                    {selectRow && (
                        <button
                            className="bg-[#E94444] mr-5 px-6"
                            onClick={onDelete}
                        >
                            삭제하기
                        </button>
                    )}
                    <button className="bg-[#21a089] px-6" onClick={onSave}>
                        {selectRow ? "수정하기" : "저장하기"}
                    </button>
                </div> */}
            </div>
        </>
    );
};

export { DetailForm };
