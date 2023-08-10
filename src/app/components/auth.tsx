'use client'

import { useState } from 'react';
import { SessionProvider, useSession, signIn, signOut } from 'next-auth/react';
import ViPopup from './popup';

export default function AuthControls() {
    const {data, status} = useSession();
    const [signInOpen, setSignInOpen] = useState(false);

    const closeSignIn = () => setSignInOpen(false);

    return (
    <>
        <SessionProvider>
            <div className='flex justify-end w-full space-x-2 bg-yellow-600'>
                <p>{status}</p>
                { !data? <button onClick={()=>signIn()}>SignIn</button> : <button onClick={()=>signOut()}>Logout</button> }
            </div>
            <ViPopup isOpen={signInOpen} onClose={closeSignIn}>
                <div>Sign In Open</div>
            </ViPopup>
        </SessionProvider>
    </>);
}
