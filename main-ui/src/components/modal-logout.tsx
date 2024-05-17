import { FunctionComponent } from 'react';

interface ModalLogoutProps {

}

const ModalLogout: FunctionComponent<ModalLogoutProps> = () => {
    return (
        <dialog open className="dai-modal modal-bottom sm:dai-modal-middle">
            <div className="dai-modal-box">
                <h3 className="font-bold text-lg">Hello!</h3>
                <p className="py-4">Press ESC key or click the button below to close</p>
                <div className="dai-modal-action">
                    <form method="dialog">
                        {/* if there is a button in form, it will close the modal */}
                        <button className="dai-btn">Close</button>
                    </form>
                </div>
            </div>
        </dialog>
    );
};

export default ModalLogout;