import React, { useState } from 'react';
import axios from 'axios';
import {
  Container,
  Box,
  TextField,
  Button,
  Typography,
  Card,
  CardContent,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  CircularProgress
} from '@mui/material';

function App() {
  const [topic, setTopic] = useState('');
  const [language, setLanguage] = useState('');
  const [difficulty, setDifficulty] = useState('beginner');
  const [problems, setProblems] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const response = await axios.post('http://localhost:3001/generate-problems', {
        topic,
        language,
        difficulty
      });
      const data = response.data.problems;
      try {
        setProblems(typeof data === 'string' ? JSON.parse(data) : data);
      } catch (parseError) {
        console.error('Error parsing response:', parseError);
        setError('Invalid response format from server');
      }
    } catch (err) {
      setError('Failed to generate problems. Please try again.');
      console.error('Error:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container maxWidth="md">
      <Box sx={{ my: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          Programming Practice Generator
        </Typography>
        
        <Box component="form" onSubmit={handleSubmit} sx={{ mt: 3 }}>
          <TextField
            fullWidth
            label="Programming Topic"
            value={topic}
            onChange={(e) => setTopic(e.target.value)}
            margin="normal"
            required
          />
          
          <TextField
            fullWidth
            label="Programming Language"
            value={language}
            onChange={(e) => setLanguage(e.target.value)}
            margin="normal"
            required
          />
          
          <FormControl fullWidth margin="normal">
            <InputLabel>Difficulty Level</InputLabel>
            <Select
              value={difficulty}
              onChange={(e) => setDifficulty(e.target.value)}
              label="Difficulty Level"
            >
              <MenuItem value="beginner">Beginner</MenuItem>
              <MenuItem value="intermediate">Intermediate</MenuItem>
              <MenuItem value="advanced">Advanced</MenuItem>
            </Select>
          </FormControl>
          
          <Button
            type="submit"
            variant="contained"
            color="primary"
            fullWidth
            sx={{ mt: 2 }}
            disabled={loading}
          >
            {loading ? <CircularProgress size={24} /> : 'Generate Problems'}
          </Button>
        </Box>

        {error && (
          <Typography color="error" sx={{ mt: 2 }}>
            {error}
          </Typography>
        )}

        {problems && (
          <Box sx={{ mt: 4 }}>
            {problems.map((problem, index) => (
              <Card key={index} sx={{ mb: 2 }}>
                <CardContent>
                  <Typography variant="h6" gutterBottom>
                    Problem {index + 1}
                  </Typography>
                  <Typography variant="body1" paragraph>
                    {problem.statement}
                  </Typography>
                  <Typography variant="h6" gutterBottom>
                    Example Input/Output:
                  </Typography>
                  <Typography variant="body1" paragraph>
                    {problem.example}
                  </Typography>
                  <Typography variant="h6" gutterBottom>
                    Hints:
                  </Typography>
                  <Typography variant="body1" paragraph>
                    {problem.hints}
                  </Typography>
                  <Typography variant="h6" gutterBottom>
                    Learning Objectives:
                  </Typography>
                  <Typography variant="body1">
                    {problem.objectives}
                  </Typography>
                </CardContent>
              </Card>
            ))}
          </Box>
        )}
      </Box>
    </Container>
  );
}

export default App;
