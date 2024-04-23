import * as yup from 'yup';

const commentSchema = yup.object().shape({
  comment: yup.string().required('댓글을 남겨보세요.'),
});

export interface CommentInputs {
  comment: string;
}

export default commentSchema;
