// Importaciones necesarias desde Angular para manejar peticiones HTTP y la inyección de dependencias
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
// Importa la constante URL_SERVICIOS que contiene la URL base para los servicios API
import { URL_SERVICIOS } from '@core/models/config';
// Importa Observable para manejar operaciones asíncronas
import { Observable } from 'rxjs';
// Importa el servicio de autenticación para obtener el token
import { AuthService } from '@core/service/auth.service';

/**
 * Servicio para gestión de proyectos
 * Proporciona métodos para crear, leer, actualizar y eliminar proyectos,
 * además de asignar y remover usuarios en proyectos
 */
@Injectable({
  providedIn: 'root' // Este servicio está disponible en toda la aplicación
})
export class ProjectsService {
  // URL base de la API (configurada en los archivos de entorno)
  private readonly urlBaseServices: string = URL_SERVICIOS;

  // Inyecta HttpClient para realizar llamadas HTTP y AuthService para gestionar autenticación
  constructor(
    private readonly http: HttpClient,
    private authService: AuthService
  ) { }

  // Método privado que construye los headers HTTP necesarios para las peticiones autenticadas
  private getHeaders(): HttpHeaders {
    // Obtiene el token JWT desde el servicio de autenticación
    const token = this.authService.getToken();
    // Retorna los headers incluyendo el Content-Type y el token en Authorization
    return new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    });
  }

  /**
   * Crea un nuevo proyecto en el sistema
   * @param projectData - Datos del proyecto a crear
   * @returns Observable con la respuesta del servidor
   */
  createProject(projectData: any): Observable<any> {
    // Obtiene los headers para autenticación (aunque no se usan en la llamada actual)
    const headers = this.getHeaders();
    // Define la URL completa del endpoint para crear proyectos
    const endpoint = `${this.urlBaseServices}/api/v1/projects`;
    // Realiza una petición POST enviando los datos del proyecto
    return this.http.post<any>(endpoint, projectData);
  }

  /**
   * Actualiza un proyecto existente
   * @param projectId - ID del proyecto a actualizar
   * @param projectData - Objeto con los nuevos datos del proyecto
   * @returns Observable con la respuesta del servidor
   */
  updateProject(projectId: number, projectData: any): Observable<any> {
    // Construye la URL para el proyecto específico
    const endpoint = `${this.urlBaseServices}/api/v1/projects/${projectId}`;
    // Realiza una petición PUT para actualizar los datos del proyecto
    return this.http.put<any>(endpoint, projectData);
  }

  /**
   * Elimina un proyecto del sistema
   * @param projectId - ID del proyecto a eliminar
   * @returns Observable con la respuesta del servidor
   */
  deleteProject(projectId: number): Observable<any> {
    // Construye la URL para eliminar el proyecto por ID
    const endpoint = `${this.urlBaseServices}/api/v1/projects/${projectId}`;
    // Realiza una petición DELETE para eliminar el proyecto
    return this.http.delete<any>(endpoint);
  }

  /**
   * Obtiene proyectos filtrados por administrador
   * @param id - ID del administrador
   * @param filters - Objeto opcional con filtros de búsqueda (nombre, estado, administrador_id)
   * @returns Observable con el listado de proyectos
   */
  getAllProjectsByAdministrator(id: number, filters?: any): Observable<any> {
    // Define la URL base para obtener los proyectos
    const endpoint = `${this.urlBaseServices}/api/v1/projects`;
    // Construye los parámetros para filtrar la búsqueda
    const params = new HttpParams({
      fromObject: {
        nombre: filters?.name || '',    // Filtro por nombre del proyecto o vacío si no hay
        estado: filters?.status || '',  // Filtro por estado o vacío si no hay
        administrador_id: filters?.administrador_id || '' // Filtro por id de administrador si existe
      }
    });
    // Realiza una petición GET con los parámetros de filtrado
    return this.http.get<any>(endpoint, { params });
  }

  /**
   * Asigna usuarios a un proyecto específico
   * @param projectId - ID del proyecto
   * @param userIds - Lista de IDs de usuarios a asignar
   * @returns Observable con la respuesta del servidor
   */
  assignUsersToProject(projectId: number, userIds: number[]): Observable<any> {
    // Construye el endpoint para asignar usuarios al proyecto
    const endpoint = `${this.urlBaseServices}/api/v1/projects/${projectId}/users`;
    // Realiza una petición POST con los IDs de usuarios y headers de autenticación
    return this.http.post(endpoint, { user_ids: userIds }, { headers: this.getHeaders() });
  }

  /**
   * Remueve un usuario asignado a un proyecto
   * @param projectId - ID del proyecto
   * @param userId - ID del usuario a remover
   * @returns Observable con la respuesta del servidor
   */
  removeUserFromProject(projectId: number, userId: number): Observable<any> {
    // Construye el endpoint para eliminar al usuario del proyecto
    const endpoint = `${this.urlBaseServices}/api/v1/projects/${projectId}/users/${userId}`;
    // Realiza una petición DELETE con headers de autenticación
    return this.http.delete(endpoint, { headers: this.getHeaders() });
  }
}
