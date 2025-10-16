import React from 'react'

type GetHelpCardProps = {
    title: string
    description: string
    actionText?: string
    onAction?: () => void
}

function GetHelpCard({ title, description, actionText, onAction }: GetHelpCardProps) {
    return (
        <div className="rounded-lg border bg-white/80 p-4">
            <h3 className="text-base font-semibold mb-1">{title}</h3>
            <p className="text-sm text-gray-700 mb-3">{description}</p>
            {actionText && onAction && (
                <button className="px-3 py-1.5 text-sm rounded-md bg-blue-600 text-white hover:bg-blue-700" onClick={onAction}>
                    {actionText}
                </button>
            )}
        </div>
    )
}

export default GetHelpCard


