import { Component, inject, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { ContentService } from '@app/core/services/content.service';
import { NewsItem } from '@app/core/models/site.models';

@Component({
  selector: 'app-news-editor',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  template: `
    <div>
      <div class="flex items-center justify-between mb-8">
        <h1 class="text-2xl font-display font-bold text-primary">Gestión de Noticias</h1>
        <button (click)="openAddModal()" class="btn-secondary">
          + Nueva noticia
        </button>
      </div>

      <!-- News List -->
      <div class="bg-white rounded-xl shadow-soft overflow-hidden">
        <table class="w-full">
          <thead class="bg-gray-50 border-b">
            <tr>
              <th class="px-6 py-4 text-left text-sm font-semibold text-gray-600">Título</th>
              <th class="px-6 py-4 text-left text-sm font-semibold text-gray-600">Fecha</th>
              <th class="px-6 py-4 text-left text-sm font-semibold text-gray-600">Estado</th>
              <th class="px-6 py-4 text-right text-sm font-semibold text-gray-600">Acciones</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-gray-100">
            @for (news of news(); track news.id) {
              <tr class="hover:bg-gray-50">
                <td class="px-6 py-4">
                  <span class="font-medium text-gray-800">{{ news.title }}</span>
                </td>
                <td class="px-6 py-4 text-sm text-gray-500">
                  {{ news.publishedAt | date:'dd MMM yyyy' }}
                </td>
                <td class="px-6 py-4">
                  <button 
                    (click)="toggleActive(news)"
                    class="px-3 py-1 rounded-full text-xs font-medium"
                    [class.bg-green-100]="news.isActive"
                    [class.text-green-700]="news.isActive"
                    [class.bg-gray-100]="!news.isActive"
                    [class.text-gray-600]="!news.isActive"
                  >
                    {{ news.isActive ? 'Activa' : 'Inactiva' }}
                  </button>
                </td>
                <td class="px-6 py-4 text-right">
                  <button 
                    (click)="openEditModal(news)"
                    class="text-gray-400 hover:text-accent mr-3"
                  >
                    <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"></path>
                    </svg>
                  </button>
                  <button 
                    (click)="deleteNews(news)"
                    class="text-gray-400 hover:text-red-500"
                  >
                    <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path>
                    </svg>
                  </button>
                </td>
              </tr>
            }
          </tbody>
        </table>

        @if (news().length === 0) {
          <div class="p-8 text-center text-gray-500">
            No hay noticias. ¡Crea una nueva!
          </div>
        }
      </div>

      <!-- Modal -->
      @if (showModal()) {
        <div class="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div class="bg-white rounded-xl shadow-xl max-w-lg w-full p-6">
            <div class="flex items-center justify-between mb-6">
              <h2 class="text-xl font-semibold text-primary">
                {{ editingNews() ? 'Editar' : 'Nueva' }} noticia
              </h2>
              <button (click)="closeModal()" class="text-gray-400 hover:text-gray-600">
                <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
                </svg>
              </button>
            </div>

            <form [formGroup]="form" (ngSubmit)="onSubmit()" class="space-y-4">
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">Título</label>
                <input 
                  type="text" 
                  formControlName="title"
                  class="input-base"
                  placeholder="Título de la noticia"
                >
              </div>

              <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">Contenido</label>
                <textarea 
                  formControlName="content"
                  rows="4"
                  class="input-base resize-none"
                  placeholder="Contenido de la noticia..."
                ></textarea>
              </div>

              <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">Resumen (excerpt)</label>
                <input 
                  type="text" 
                  formControlName="excerpt"
                  class="input-base"
                  placeholder="Breve resumen..."
                >
              </div>

              <div class="flex items-center gap-2">
                <input 
                  type="checkbox" 
                  formControlName="isActive"
                  id="isActive"
                  class="w-4 h-4 text-accent rounded"
                >
                <label for="isActive" class="text-sm text-gray-700">Activa</label>
              </div>

              <div class="flex gap-3 pt-4">
                <button 
                  type="button" 
                  (click)="closeModal()"
                  class="btn-outline flex-1"
                >
                  Cancelar
                </button>
                <button 
                  type="submit" 
                  class="btn-primary flex-1"
                  [disabled]="form.invalid"
                >
                  {{ editingNews() ? 'Guardar' : 'Crear' }}
                </button>
              </div>
            </form>
          </div>
        </div>
      }
    </div>
  `
})
export class NewsEditorComponent {
  private contentService = inject(ContentService);
  private fb = inject(FormBuilder);

  news = computed(() => this.contentService.site().news);
  showModal = signal(false);
  editingNews = signal<NewsItem | null>(null);

  form = this.fb.group({
    title: ['', [Validators.required, Validators.maxLength(150)]],
    content: ['', [Validators.required, Validators.maxLength(2000)]],
    excerpt: [''],
    isActive: [true]
  });

  openAddModal() {
    this.editingNews.set(null);
    this.form.reset({ isActive: true });
    this.showModal.set(true);
  }

  openEditModal(news: NewsItem) {
    this.editingNews.set(news);
    this.form.patchValue({
      title: news.title,
      content: news.content,
      excerpt: news.excerpt,
      isActive: news.isActive
    });
    this.showModal.set(true);
  }

  closeModal() {
    this.showModal.set(false);
    this.editingNews.set(null);
  }

  onSubmit() {
    if (this.form.valid) {
      const values = this.form.value;
      const editing = this.editingNews();
      if (editing) {
        this.contentService.updateNews(editing.id, {
          title: values.title || '',
          content: values.content || '',
          excerpt: values.excerpt || '',
          isActive: values.isActive ?? true
        });
      } else {
        this.contentService.addNews({
          title: values.title || '',
          content: values.content || '',
          excerpt: values.excerpt || '',
          publishedAt: new Date(),
          isActive: values.isActive ?? true
        });
      }
      this.closeModal();
    }
  }

  toggleActive(news: NewsItem) {
    this.contentService.updateNews(news.id, { isActive: !news.isActive });
  }

  deleteNews(news: NewsItem) {
    if (confirm('¿Estás seguro de que quieres eliminar esta noticia?')) {
      this.contentService.deleteNews(news.id);
    }
  }
}