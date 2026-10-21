import Spinner from "@/components/icons/spinner";

export default function Loading() {
    return (
        <div className="flex items-center justify-center w-full text-ui-fg-base h-full m-auto">
            <Spinner size={36} />
        </div>
    );
}
