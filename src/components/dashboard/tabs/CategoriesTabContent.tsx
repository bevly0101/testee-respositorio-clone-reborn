
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Category, ToastFunction } from '../types';

interface CategoriesTabContentProps {
  categories: Category[];
  toast: ToastFunction;
}

const CategoriesTabContent: React.FC<CategoriesTabContentProps> = ({ categories, toast }) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Categorias de Despesas</CardTitle>
        <CardDescription>Gerencie suas categorias de gastos</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex justify-end mb-4">
          <Button size="sm" onClick={() => {
            toast({
              title: "Em breve!",
              description: "A funcionalidade de adicionar categorias estará disponível em breve."
            });
          }}>Nova Categoria</Button>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {categories.map((category, index) => (
            <Card key={category.id || `cat-${index}`}> {/* Use category.id if available */}
              <CardContent className="p-4 flex items-center justify-between">
                <div className="flex items-center">
                  <div 
                    className="w-4 h-4 rounded-full mr-2" 
                    style={{ backgroundColor: category.color }}
                  ></div>
                  <h3 className="font-medium">{category.name}</h3>
                </div>
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={() => {
                    toast({
                      title: "Em breve!",
                      description: "A edição de categorias estará disponível em breve."
                    });
                  }}
                >Editar</Button>
              </CardContent>
            </Card>
          ))}
          {categories.length === 0 && (
             <div className="col-span-full text-center py-10 text-gray-500">
                <p>Nenhuma categoria definida ainda.</p>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default CategoriesTabContent;

