import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  title = 'Todo List';

  newTodoText: string = '';
  todos: Array<{
    id: string;
    text: string;
    completed: boolean;
    createdAt: number;
  }> = [];

  filter: 'all' | 'active' | 'completed' = 'all';

  constructor() {
    this.loadFromStorage();
  }

  get filteredTodos() {
    if (this.filter === 'active') {
      return this.todos.filter(t => !t.completed);
    }
    if (this.filter === 'completed') {
      return this.todos.filter(t => t.completed);
    }
    return this.todos;
  }

  addTodo(): void {
    const text = this.newTodoText.trim();
    if (!text) return;
    const todo = {
      id: crypto.randomUUID(),
      text,
      completed: false,
      createdAt: Date.now()
    };
    this.todos = [todo, ...this.todos];
    this.newTodoText = '';
    this.saveToStorage();
  }

  toggleTodo(todoId: string): void {
    this.todos = this.todos.map(t => (t.id === todoId ? { ...t, completed: !t.completed } : t));
    this.saveToStorage();
  }

  removeTodo(todoId: string): void {
    this.todos = this.todos.filter(t => t.id !== todoId);
    this.saveToStorage();
  }

  clearCompleted(): void {
    this.todos = this.todos.filter(t => !t.completed);
    this.saveToStorage();
  }

  setFilter(next: 'all' | 'active' | 'completed'): void {
    this.filter = next;
  }

  private saveToStorage(): void {
    localStorage.setItem('todos', JSON.stringify(this.todos));
  }

  private loadFromStorage(): void {
    try {
      const raw = localStorage.getItem('todos');
      this.todos = raw ? JSON.parse(raw) : [];
    } catch {
      this.todos = [];
    }
  }
}
