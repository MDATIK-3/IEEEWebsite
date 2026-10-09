export interface MemberSocial {
    facebook?: string;
    linkedin?: string;
    email?: string;
}

export interface Member {
    name: string;
    role: string;
    img?: string;
    social?: MemberSocial;
    isFaculty?: boolean;
}

export interface MemberDetailModalProps {
    member: Member | null;
    onClose: () => void;
}
