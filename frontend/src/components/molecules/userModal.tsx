import { UserRoleList } from "src/constants/index";
import { Button } from "../atoms/button";

type ModalProps = {
    data: any;
    onClose: () => void;
};

const UserModal = ({ data, onClose }: ModalProps) => {
    const dataArray = [
        { title: "이름", content: data.name },
        { title: "아이디", content: data.loginId },
        { title: "성별", content: data.gender == "m" ? "남성" : "여성" },
        { title: "생년월일", content: data.birthday },
        {
            title: "권한",
            content: UserRoleList.find((item) => data.role === item.name)
                ?.value,
        },
        {
            title: "소속",
            content: data.schoolName ?? data.otherSchoolName ?? "-",
        },
        { title: "가입일", content: data.createdAt },
    ];
    console.log(data);

    return (
        <div className="flex flex-col gap-[20px] w-[400px] h-fit pt-[33px] px-[13px]">
            {dataArray.map((value) => (
                <div className="flex items-center">
                    <p className="text-[15px] leading-[18px] mr-5 font-semibold w-[80px] text-[rgba(68,68,68,0.6)] border-r border-[#D6D6D6]">
                        {value.title}
                    </p>
                    <p className="text-[15px] leading-[18px] text-[#333] flex-grow font-normal">
                        {value.content && (
                            <div className="p-2">{value.content}</div>
                        )}
                    </p>
                </div>
            ))}

            <div className="flex flex-grow justify-center items-end gap-5 mb-[33px]">
                <Button
                    className="h-[35px] px-[36px] bg-[#21A089]"
                    onClick={onClose}
                >
                    닫기
                </Button>
            </div>
        </div>
    );
};

export default UserModal;
