import * as yup from 'yup';

const commentSchema = yup.object().shape({
  comment: yup.string().required('댓글을 남겨보세요.'),
  id: yup.number().required(),
});

export interface CommentInputs {
  comment: string;
  id: number;
}

export default commentSchema;
