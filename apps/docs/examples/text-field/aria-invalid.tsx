import { TextField } from "@/components/ui/v2/text-field";
export default function Invalid() {
  return (
    <div className="grid w-full max-w-sm gap-5">
      <TextField
        label="Email"
        type="email"
        aria-invalid="true"
        aria-describedby="email-error"
        defaultValue="invalid"
      />
      <p id="email-error" className="m-0 text-xs text-semantic-error-text">
        Enter a valid email address.
      </p>
      <TextField
        label="Workspace address"
        prefix="https://"
        aria-invalid="true"
        aria-describedby="workspace-error"
        defaultValue="taken"
      />
      <p id="workspace-error" className="m-0 text-xs text-semantic-error-text">
        Choose another workspace address.
      </p>
    </div>
  );
}
