import { Button, Paper } from "@mantine/core";
import { IconPlus } from "@tabler/icons-react";

const AddListPlaceHolder: React.FC<{ openCreateListModal: () => void }> = ({
  openCreateListModal,
}) => (
  <div
    className="flex flex-none h-full min-h-96 w-80 flex-col items-center justify-start rounded-md p-2 cursor-pointer border-2 border-dashed border-black/10 hover:bg-white/10 hover:shadow-lg"
    onClick={openCreateListModal}
  >
    <Button
      leftSection={<IconPlus />}
      variant="transparent"
      className="my-auto w-full"
    >
      Add List
    </Button>
  </div>
);

export default AddListPlaceHolder;
