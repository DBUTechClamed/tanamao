
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { UserProfile, UserRole } from '@/types';

export const useUsers = (storeId?: string, regionId?: string) => {
  const [users, setUsers] = useState<UserProfile[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      let query = supabase
        .from('user_profiles')
        .select('*');

      if (storeId) {
        query = query.eq('store_id', storeId);
      }

      if (regionId) {
        query = query.eq('region_id', regionId);
      }

      const { data, error } = await query;

      if (error) throw error;

      const formattedUsers: UserProfile[] = data?.map(user => ({
        id: user.id,
        name: user.name,
        role: user.role as UserRole,
        storeId: user.store_id,
        regionId: user.region_id,
        position: user.position
      })) || [];

      setUsers(formattedUsers);
    } catch (error) {
      console.error('Error fetching users:', error);
    } finally {
      setLoading(false);
    }
  };

  const getUserById = (id: string) => {
    return users.find(user => user.id === id);
  };

  const getUsersByRole = (role: UserRole, targetStoreId?: string) => {
    return users.filter(user => {
      const roleMatch = user.role === role;
      if (targetStoreId) {
        return roleMatch && user.storeId === targetStoreId;
      }
      return roleMatch;
    });
  };

  useEffect(() => {
    fetchUsers();
  }, [storeId, regionId]);

  return {
    users,
    loading,
    fetchUsers,
    getUserById,
    getUsersByRole
  };
};
