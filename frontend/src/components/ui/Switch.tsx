
'use client';

type SwitchProps = {
  id: string;
  value: string;
  className?: string;
  switchLabel: string;
  onHide?: React.Dispatch<React.SetStateAction<boolean>>;
  hide?: boolean;
};

export default function Switch({
  className,
  id,
  value,
  hide,
  switchLabel,
  onHide,
}: SwitchProps) {
  return (
    <>
      <label className='switch'>
        <input
          type="checkbox"
          id={id}
          value={value}
          name={value}
          checked={hide}
          onChange={(e) => {
            if (e.target.checked) {
              onHide!(true);
            } else {
              onHide!(false);
            }
          }}
        />
        <span className='slider round'></span>
      </label>
      <label htmlFor={`hide`}></label>
    </>
  );
}
