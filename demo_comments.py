#!/usr/bin/env python3
"""
Demo script to showcase the Comment CRUD APIs
Run this after starting the Flask server (python app.py)
"""

import requests
import json

BASE_URL = 'http://localhost:5000'

def demo_comment_apis():
    print("=== Task Manager Comment APIs Demo ===\\n")
    
    # First, create a task to comment on
    print("1. Creating a sample task...")
    task_data = {
        'title': 'Demo Task',
        'description': 'A task to demonstrate comment functionality'
    }
    
    task_response = requests.post(f'{BASE_URL}/tasks', json=task_data)
    if task_response.status_code == 201:
        task = task_response.json()
        task_id = task['id']
        print(f"   ✓ Created task with ID: {task_id}")
    else:
        print("   ✗ Failed to create task")
        return
    
    # Create comments
    print("\\n2. Creating comments...")
    comments_data = [
        {'task_id': task_id, 'content': 'This is the first comment'},
        {'task_id': task_id, 'content': 'This is a second comment with more details'},
        {'task_id': task_id, 'content': 'Final comment for testing'}
    ]
    
    created_comments = []
    for i, comment_data in enumerate(comments_data, 1):
        response = requests.post(f'{BASE_URL}/comments', json=comment_data)
        if response.status_code == 201:
            comment = response.json()
            created_comments.append(comment)
            print(f"   ✓ Created comment {i}: {comment['content'][:30]}...")
        else:
            print(f"   ✗ Failed to create comment {i}")
    
    # Get all comments for the task
    print("\\n3. Retrieving comments for the task...")
    response = requests.get(f'{BASE_URL}/comments?task_id={task_id}')
    if response.status_code == 200:
        comments = response.json()
        print(f"   ✓ Retrieved {len(comments)} comments:")
        for comment in comments:
            print(f"     - ID {comment['id']}: {comment['content']}")
    else:
        print("   ✗ Failed to retrieve comments")
    
    # Update a comment
    if created_comments:
        print("\\n4. Updating a comment...")
        comment_to_update = created_comments[0]
        update_data = {'content': 'This comment has been updated!'}
        
        response = requests.put(f'{BASE_URL}/comments/{comment_to_update["id"]}', json=update_data)
        if response.status_code == 200:
            updated_comment = response.json()
            print(f"   ✓ Updated comment: {updated_comment['content']}")
        else:
            print("   ✗ Failed to update comment")
    
    # Delete a comment
    if len(created_comments) > 1:
        print("\\n5. Deleting a comment...")
        comment_to_delete = created_comments[-1]
        
        response = requests.delete(f'{BASE_URL}/comments/{comment_to_delete["id"]}')
        if response.status_code == 204:
            print(f"   ✓ Deleted comment ID: {comment_to_delete['id']}")
        else:
            print("   ✗ Failed to delete comment")
    
    # Final count
    print("\\n6. Final comment count...")
    response = requests.get(f'{BASE_URL}/comments?task_id={task_id}')
    if response.status_code == 200:
        final_comments = response.json()
        print(f"   ✓ Final count: {len(final_comments)} comments remaining")
    
    print("\\n=== Demo Complete ===")
    print("\\nTo see the full interface, start the React frontend:")
    print("cd frontend && npm start")

if __name__ == '__main__':
    try:
        demo_comment_apis()
    except requests.exceptions.ConnectionError:
        print("Error: Could not connect to Flask server.")
        print("Please make sure the server is running: python app.py")
    except Exception as e:
        print(f"Error: {e}")