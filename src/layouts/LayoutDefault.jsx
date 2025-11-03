import { Outlet } from "react-router-dom";

const LayoutDefault = () => {
  return (
    <>
      <div>
        <Outlet />
      </div>
    </>
  );
};

export default LayoutDefault;
