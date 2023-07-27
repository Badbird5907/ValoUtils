import React, {createContext, ReactNode, useContext, useState} from "react";
import {Modal, ModalBody, ModalContent, ModalFooter, ModalHeader} from "@nextui-org/modal";

interface ModalContentProps {
    title: string;
    body: React.ReactNode | React.ReactNode[];
    footer: React.ReactNode | React.ReactNode[];
    onClose?: () => void;
}

interface DynamicModalContextProps {
    showModal: (content: ModalContentProps) => void;
    closeModal: () => void;
}

const DynamicModalContext = createContext<DynamicModalContextProps>({
    showModal: () => {
    },
    closeModal: () => {
    }
});

export const useDynamicModal = (): DynamicModalContextProps => useContext(DynamicModalContext);

export const DynamicModalProvider: React.FC<{ children: ReactNode }> = ({children}) => {
    const [modalContent, setModalContent] = useState<ModalContentProps | null>(null);
    const [props, setProps] = useState<ModalContentProps | null>(null);

    const showModal = (content: ModalContentProps) => {
        setProps(content)
        setModalContent(content);
    };

    const closeModal = () => {
        setModalContent(null);
        if (props) {
            if (props.onClose) {
                props.onClose();
            }
            setProps(null);
        }
    };

    return (
        <DynamicModalContext.Provider value={{showModal, closeModal}}>
            {children}
            {modalContent && (
                <Modal isOpen hideCloseButton={true} onOpenChange={closeModal}>
                    <ModalContent>
                        {() => (
                            <>
                                <ModalHeader className="flex flex-col gap-1">{modalContent.title}</ModalHeader>
                                <ModalBody>{modalContent.body}</ModalBody>
                                <ModalFooter>{modalContent.footer}</ModalFooter>
                            </>
                        )}
                    </ModalContent>
                </Modal>
            )}
        </DynamicModalContext.Provider>
    );
};
