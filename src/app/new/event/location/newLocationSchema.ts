import * as yup from 'yup';

const newLocationSchema = yup.object().shape({
  name: yup.string().required('장소명을 입력하세요.'),
  englishName: yup.string().required('영문 장소명을 입력하세요.'),
  phoneNumber: yup.string().required('전화번호를 입력하세요.'),
  snsUrl: yup.string().url().required('SNS 주소를 입력하세요.'),
  webSiteUrl: yup.string().url().required('웹사이트 주소를 입력하세요.'),
  detailAddress: yup.string().required('상세 주소를 입력하세요.'),
});

export interface newLocationInputs {
  name: string;
  englishName: string;
  detailAddress: string;
  phoneNumber: string;
  snsUrl: string;
  webSiteUrl: string;
}

export default newLocationSchema;
