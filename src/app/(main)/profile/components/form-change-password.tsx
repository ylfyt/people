import { FunctionComponent } from 'react';

interface FormChangePasswordProps {}

export const FormChangePassword: FunctionComponent<FormChangePasswordProps> = () => {
    return (
        <form className="grid grid-cols-1 gap-4">
            <input required type="password" placeholder="Current password" className="dai-input dai-input-bordered" />
            <input required type="password" placeholder="New password" className="dai-input dai-input-bordered" />
            <input required type="password" placeholder="Confirm password" className="dai-input dai-input-bordered" />
            <div className="grid place-items-center">
                <button className="dai-btn dai-btn-primary">Submit</button>
            </div>
        </form>
    );
};
