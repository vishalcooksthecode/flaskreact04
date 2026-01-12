import unittest
import json
from app import app, db, Task, Comment

class APITestCase(unittest.TestCase):
    def setUp(self):
        self.app = app
        self.app.config['TESTING'] = True
        self.app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///:memory:'
        self.client = self.app.test_client()
        
        with self.app.app_context():
            db.create_all()

    def tearDown(self):
        with self.app.app_context():
            db.session.remove()
            db.drop_all()

    # Task API Tests
    def test_create_task(self):
        data = {'title': 'Test Task', 'description': 'Test Description'}
        response = self.client.post('/tasks', 
                                  data=json.dumps(data),
                                  content_type='application/json')
        self.assertEqual(response.status_code, 201)
        result = json.loads(response.data)
        self.assertEqual(result['title'], 'Test Task')

    def test_get_tasks(self):
        with self.app.app_context():
            task = Task(title='Test Task')
            db.session.add(task)
            db.session.commit()

        response = self.client.get('/tasks')
        self.assertEqual(response.status_code, 200)
        result = json.loads(response.data)
        self.assertEqual(len(result), 1)

    def test_update_task(self):
        with self.app.app_context():
            task = Task(title='Original Title')
            db.session.add(task)
            db.session.commit()
            task_id = task.id

        data = {'title': 'Updated Title', 'completed': True}
        response = self.client.put(f'/tasks/{task_id}',
                                 data=json.dumps(data),
                                 content_type='application/json')
        self.assertEqual(response.status_code, 200)
        result = json.loads(response.data)
        self.assertEqual(result['title'], 'Updated Title')
        self.assertTrue(result['completed'])

    def test_delete_task(self):
        with self.app.app_context():
            task = Task(title='To Delete')
            db.session.add(task)
            db.session.commit()
            task_id = task.id

        response = self.client.delete(f'/tasks/{task_id}')
        self.assertEqual(response.status_code, 204)

    # Comment API Tests
    def test_create_comment(self):
        data = {'task_id': 1, 'content': 'Test comment'}
        response = self.client.post('/comments', 
                                  data=json.dumps(data),
                                  content_type='application/json')
        self.assertEqual(response.status_code, 201)
        result = json.loads(response.data)
        self.assertEqual(result['content'], 'Test comment')

    def test_get_comments_by_task(self):
        with self.app.app_context():
            comment1 = Comment(task_id=1, content='Comment 1')
            comment2 = Comment(task_id=1, content='Comment 2')
            db.session.add_all([comment1, comment2])
            db.session.commit()

        response = self.client.get('/comments?task_id=1')
        self.assertEqual(response.status_code, 200)
        result = json.loads(response.data)
        self.assertEqual(len(result), 2)

    def test_update_comment(self):
        with self.app.app_context():
            comment = Comment(task_id=1, content='Original')
            db.session.add(comment)
            db.session.commit()
            comment_id = comment.id

        data = {'content': 'Updated'}
        response = self.client.put(f'/comments/{comment_id}',
                                 data=json.dumps(data),
                                 content_type='application/json')
        self.assertEqual(response.status_code, 200)
        result = json.loads(response.data)
        self.assertEqual(result['content'], 'Updated')

    def test_delete_comment(self):
        with self.app.app_context():
            comment = Comment(task_id=1, content='To Delete')
            db.session.add(comment)
            db.session.commit()
            comment_id = comment.id

        response = self.client.delete(f'/comments/{comment_id}')
        self.assertEqual(response.status_code, 204)

if __name__ == '__main__':
    unittest.main()