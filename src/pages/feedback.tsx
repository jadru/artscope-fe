import { Widget } from '@typeform/embed-react';

const Feedback = () => {
  const widgetContainerStyle = {
    width: '100vw',
    height: '100vh',
  };

  return (
    <Widget
      id='kg4KHrj4'
      style={widgetContainerStyle}
      medium='demo-test'
      hidden={{ foo: 'foo value', bar: 'bar value' }}
      transitiveSearchParams={['foo', 'bar']}
      iframeProps={{ title: 'Foo Bar' }}
    />
  );
};

export default Feedback;
