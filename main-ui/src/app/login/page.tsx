'use client';

import { FunctionComponent } from 'react';

interface ProfileProps {}

const Profile: FunctionComponent<ProfileProps> = () => {
    const login = async () => {};

    return (
        <div className="grid min-h-dvh w-full place-items-center">
            <form
                onSubmit={(e) => {
                    e.preventDefault();
                    login();
                }}
                className="grid grid-cols-3 gap-8 rounded-lg border p-4"
            >
                <span className="col-span-full text-center text-2xl font-semibold text-primary">Login</span>
                <label className="dai-form-control col-span-full">
                    <div className="dai-label">
                        <span className="req dai-label-text">Username</span>
                    </div>
                    <input
                        type="text"
                        required
                        placeholder="Type here"
                        className="dai-input dai-input-bordered w-full max-w-xs"
                    />
                </label>

                <label className="dai-form-control col-span-full">
                    <div className="dai-label">
                        <span className="req dai-label-text">Password</span>
                    </div>
                    <input
                        type="password"
                        required
                        placeholder="Type here"
                        className="dai-input dai-input-bordered w-full max-w-xs"
                    />
                </label>
                <div className="col-span-full flex items-center justify-center">
                    <button className="dai-btn dai-btn-primary">Submit</button>
                </div>
            </form>
        </div>
    );
};

export default Profile;
