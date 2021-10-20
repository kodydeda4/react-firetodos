import { Box, Button, Modal, Stack, Typography } from "@mui/material";

export type ModalButton = {
  text: string;
  action: () => void;
};

export type ModalState = {
  title: string;
  cancel: ModalButton;
  confirm: ModalButton;
};

export const ModalView = (props: {
  isPresented: boolean;
  onDismiss: () => void;
  modalState: ModalState;
}) => {
  return (
    <Modal open={props.isPresented} onClose={props.onDismiss}>
      <Box
        sx={{
          position: "absolute" as "absolute",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          width: 400,
          bgcolor: "background.paper",
          border: "2px solid #000",
          boxShadow: 24,
          p: 4,
        }}
      >
        <Typography variant="h6" component="h2" sx={{ pb: 3 }}>
          {props.modalState.title}
        </Typography>
        <Stack direction="row" spacing={2}>
          <Button
            variant="contained"
            onClick={() => {
              props.onDismiss();
              props.modalState.cancel.action();
            }}
          >
            {props.modalState.cancel.text}
          </Button>
          <Button
            variant="contained"
            onClick={() => {
              props.onDismiss();
              props.modalState.confirm.action();
            }}
          >
            {props.modalState.confirm.text}
          </Button>
        </Stack>
      </Box>
    </Modal>
  );
};