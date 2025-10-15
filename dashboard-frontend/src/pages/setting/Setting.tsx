import React, { useState, useEffect } from "react";
import AvatarUploader from "../../components/Settings/AvatarUploader";
import { userAPI } from "../../service/api";
import defaultAvartar from "../../assets/1.png";



const Settings = () => {
    const [avatarUrl, setAvatarUrl] = useState(defaultAvartar);
    const [isUploading, setIsUploading] = useState(false);
    const [userId, setUserId] = useState(0);

    useEffect(() => {
        const fetchAvatar = async () => {
            try {
                const responseData = await userAPI.getAvatar(); 
                if (responseData && responseData.id) {
                    console.log("id:",responseData.id)
                    setUserId(responseData.id); 
                    if (responseData.avatarUrl) {
                        setAvatarUrl(responseData.avatarUrl);
                    }
                }
            } catch (err) {
                console.error("Failed to load avatar", err);
            } finally {
                setIsUploading(false);
            }
        };
        fetchAvatar();
    }, []); 


    const handleFileSelect = async (file) => {
        try {
            setIsUploading(true);
            const response = await userAPI.uploadAvatar(userId, file);
            setAvatarUrl(response.avatarUrl);
        } catch (e) {
            console.error("Upload failed:", e);
            alert("Failed to upload avatar. Please try again.");
        } finally {
            setIsUploading(false);
        }
    };


    return (
        <div className="w-full h-full flex flex-col items-center py-10">
            <div className="w-full max-w-7xl h-full flex flex-col md:flex-row bg-white/60 rounded-xl shadow-md p-8">

                <div className="flex-1 flex flex-col gap-6 font-bold font-[Nunito] text-sm">
                    <h2 className="text-xl font-bold font-[Nunito] text-gray-800 ">Public profile</h2>

                    <div className="flex flex-col gap-1">
                        <label className="text-sm font-medium text-gray-600">Name</label>
                        <input
                            disabled
                            placeholder="Your name here..."
                            className="px-3 py-2 border rounded-lg bg-gray-50 text-gray-500"
                        />
                    </div>

                    <div className="flex flex-col gap-1">
                        <label className="text-sm font-medium text-gray-600">Public email</label>
                        <input
                            disabled
                            placeholder="Select a verified email"
                            className="px-3 py-2 border rounded-lg bg-gray-50 text-gray-500"
                        />
                    </div>

                    <div className="flex flex-col gap-1">
                        <label className="text-sm font-medium text-gray-600">Bio</label>
                        <textarea
                            disabled
                            placeholder="Tell us a little bit about yourself..."
                            className="px-3 py-2 border rounded-lg bg-gray-50 text-gray-500 h-24 resize-none"
                        />
                    </div>

                    <div className="flex flex-col gap-1">
                        <label className="text-sm font-medium text-gray-600">Pronouns</label>
                        <select
                            disabled
                            className="px-3 py-2 border rounded-lg bg-gray-50 text-gray-500"
                        >
                            <option>Don't specify</option>
                            <option>He/Him</option>
                            <option>She/Her</option>
                            <option>They/Them</option>
                        </select>
                    </div>

                    <div className="flex flex-col gap-1">
                        <label className="text-sm font-medium text-gray-600">URL</label>
                        <input
                            disabled
                            placeholder="Link to your website"
                            className="px-3 py-2 border rounded-lg bg-gray-50 text-gray-500"
                        />
                    </div>
                </div>


                <div className="w-full md:w-1/3 flex flex-col items-center">
                    <h3 className="text-xl font-bold font-[Nunito] text-gray-700 mb-4">Profile picture</h3>

                    <AvatarUploader
                        currentAvatar={avatarUrl}
                        isUploading={isUploading}
                        onFileSelect={handleFileSelect} />

                </div>
            </div>
        </div>
    );
};

export default Settings;