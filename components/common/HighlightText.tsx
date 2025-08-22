import React from 'react';
import { Text, StyleSheet } from 'react-native';

interface HighlightTextProps {
  text: string;
  searchTerm?: string;
  style?: any;
}

const HighlightText: React.FC<HighlightTextProps> = ({ text, searchTerm, style }) => {
  if (!searchTerm || !text) {
    return <Text style={style}>{text}</Text>;
  }

  const parts = text.toString().split(new RegExp(`(${searchTerm})`, 'gi'));
  
  return (
    <Text style={style}>
      {parts.map((part, index) => 
        part.toLowerCase() === searchTerm.toLowerCase() ? (
          <Text key={index} style={styles.highlighted}>
            {part}
          </Text>
        ) : (
          <Text key={index}>{part}</Text>
        )
      )}
    </Text>
  );
};

const styles = StyleSheet.create({
  highlighted: {
    backgroundColor: '#fef3c7',
    paddingHorizontal: 4,
    borderRadius: 4,
  },
});

export default HighlightText;
