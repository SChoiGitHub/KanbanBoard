import { Box, Modal } from "@mui/material";

type Props = { children: React.ReactNode, open: boolean, onClose: () => any };
export const CenterModal = ({ children, open, onClose }: Props) => {
  return (
    <Modal
      open={open}
      onClose={onClose}
    >
      <Box sx={{
        background: "#FFFFFF",
        top: "50%",
        left: "50%",
        transform: 'translate(-50%, -50%)',
        position: 'absolute',
        padding: "16px"
      }}>
        {children}
      </Box>
    </Modal>
  );
}