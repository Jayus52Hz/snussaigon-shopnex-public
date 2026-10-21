const ErrorMessage = ({
    "data-testid": dataTestid,
    error,
}: {
    "data-testid"?: string;
    error?: null | string;
}) => {
    if (!error) {
        return null;
    }

    return (
        <div
            className="pt-2 text-rose-500 text-small-regular"
            data-testid={dataTestid}
        >
            <span>{error}</span>
        </div>
    );
};

export default ErrorMessage;
